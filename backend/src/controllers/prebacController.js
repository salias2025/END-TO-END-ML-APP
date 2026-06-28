// backend/src/controllers/prebacController.js
const prebacService = require('../services/prebacService');
const PrebacResult = require('../models/PrebacResult');

// ============================================
// @route   POST /api/prebac/predict
// @desc    Predict BAC and get cluster info
// @access  Private (requires token)
// ============================================
const predict = async (req, res) => {
  try {
    const userData = req.body;

    console.log('📝 Pre-BAC Prediction Request:', userData);

    // Validate required fields
    const requiredFields = [
      'filiere', 'as2_avg_global', 'as1_avg_global', 'brevet_avg',
      'as2_math', 'as2_physics', 'as2_science', 'as2_arabic', 'as2_langues'
    ];

    for (const field of requiredFields) {
      if (userData[field] === undefined || userData[field] === null) {
        return res.status(400).json({
          success: false,
          message: `الحقل ${field} مطلوب`
        });
      }
    }

    // Calculate derived features
    const derivedFeatures = prebacService.calculateDerivedFeatures(userData);

    // Calculate predicted BAC
    const predictedBac = prebacService.predictBacRegression(userData);

    // Determine cluster based on predicted BAC and filière
    const filiereCode = prebacService.FILIERE_MAP[userData.filiere] || 'sciences_experimentales';
    const clusterNames = prebacService.CLUSTER_NAMES[filiereCode] || prebacService.DEFAULT_CLUSTERS;

    let clusterId = 0;
    let clusterBacMean = 14;

    if (filiereCode === 'sciences_experimentales') {
      if (predictedBac >= 17) { clusterId = 0; clusterBacMean = 17.5; }
      else if (predictedBac >= 15.5) { clusterId = 1; clusterBacMean = 15.8; }
      else if (predictedBac >= 13.5) { clusterId = 2; clusterBacMean = 13.8; }
      else if (predictedBac >= 11.5) { clusterId = 3; clusterBacMean = 11.8; }
      else if (predictedBac >= 9) { clusterId = 4; clusterBacMean = 9.5; }
      else { clusterId = 5; clusterBacMean = 7.5; }
    } else if (filiereCode === 'maths') {
      if (predictedBac >= 17.5) { clusterId = 0; clusterBacMean = 17.8; }
      else if (predictedBac >= 14.5) { clusterId = 1; clusterBacMean = 15.0; }
      else { clusterId = 2; clusterBacMean = 10.5; }
    } else {
      if (predictedBac >= 14) { clusterId = 0; clusterBacMean = 14.5; }
      else if (predictedBac >= 11.5) { clusterId = 1; clusterBacMean = 12.0; }
      else { clusterId = 2; clusterBacMean = 9.5; }
    }

    const clusterName = clusterNames[clusterId]?.name || `Cluster ${clusterId}`;

    // Determine mention
    let mention, emoji;
    if (predictedBac >= 18) { mention = 'ممتاز 🌟'; emoji = '🏆'; }
    else if (predictedBac >= 16) { mention = 'جيد جداً 👍'; emoji = '📈'; }
    else if (predictedBac >= 14) { mention = 'جيد ✅'; emoji = '📚'; }
    else if (predictedBac >= 12) { mention = 'مقبول 📖'; emoji = '⚠️'; }
    else if (predictedBac >= 10) { mention = 'ناجح - على الحافة 🎯'; emoji = '🔔'; }
    else { mention = 'أقل من النجاح - خطر 🚨'; emoji = '🚨'; }

    // Prepare response
    const result = {
      predicted_bac: parseFloat(predictedBac.toFixed(1)),
      cluster_id: clusterId,
      cluster_bac_mean: clusterBacMean,
      cluster_name: clusterName,
      filiere_code: filiereCode,
      filiere_name: userData.filiere,
      mention: mention,
      emoji: emoji,
      archetype: clusterName
    };

    res.json({
      success: true,
      data: result,
      derived_features: derivedFeatures
    });

  } catch (error) {
    console.error('❌ Pre-BAC Prediction Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في تحليل البيانات',
      error: error.message
    });
  }
};

// ============================================
// @route   POST /api/prebac/match
// @desc    Find closest matching student
// @access  Private (requires token)
// ============================================
const findMatch = async (req, res) => {
  try {
    const userData = req.body;

    console.log('🔍 Match Request:', userData);
    console.log('📊 Data loaded check:', prebacService.getDataLoaded());
    console.log('📊 Total students:', prebacService.getTotalStudents());

    const matchData = prebacService.findClosestStudent(userData);

    console.log('📊 Match Result:', matchData);

    res.json({
      success: true,
      data: matchData
    });

  } catch (error) {
    console.error('❌ Match Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في البحث عن الطالب المطابق',
      error: error.message
    });
  }
};

// ============================================
// @route   POST /api/prebac/features
// @desc    Calculate derived features only
// @access  Private (requires token)
// ============================================
const getDerivedFeatures = async (req, res) => {
  try {
    const userData = req.body;

    const derivedFeatures = prebacService.calculateDerivedFeatures(userData);

    res.json({
      success: true,
      data: derivedFeatures
    });

  } catch (error) {
    console.error('❌ Derived Features Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حساب المعالم المشتقة',
      error: error.message
    });
  }
};

// ============================================
// @route   POST /api/prebac/save
// @desc    Save pre-bac results to database
// @access  Private (requires token)
// ============================================
const saveResult = async (req, res) => {
  try {
    const userId = req.user.id;
    const userData = req.body;

    console.log('💾 Saving Pre-BAC result for user:', userId);
    console.log('📊 Data to save:', userData);

    // Validate required fields
    if (!userData.filiere) {
      return res.status(400).json({
        success: false,
        message: 'الشعبة مطلوبة'
      });
    }

    if (userData.predicted_bac_avg === undefined || userData.predicted_bac_avg === null) {
      return res.status(400).json({
        success: false,
        message: 'المعدل المتوقع مطلوب'
      });
    }

    // Build derived features from user data
    const derivedFeatures = {
      study_efficiency: userData.derived_features?.study_efficiency || 0,
      grinder_index: userData.derived_features?.grinder_index || 0,
      time_allocation_ratio: userData.derived_features?.time_allocation_ratio || 0,
      resource_reliance: userData.derived_features?.resource_reliance || 0,
      improvement_momentum: userData.derived_features?.improvement_momentum || 0,
      grade_volatility: userData.derived_features?.grade_volatility || 0,
      stress_performance_ratio: userData.derived_features?.stress_performance_ratio || 0,
      sleep_debt: userData.derived_features?.sleep_debt || 0,
      health_stress_index: userData.derived_features?.health_stress_index || 0,
      weakness_count: userData.derived_features?.weakness_count || 0,
      problem_solving_gap: userData.derived_features?.problem_solving_gap || 0,
      weakness_concentration: userData.derived_features?.weakness_concentration || 0,
      science_lang_gap: userData.derived_features?.science_lang_gap || 0,
      subject_balance: userData.derived_features?.subject_balance || 0,
      filiere_alignment: userData.derived_features?.filiere_alignment || 0,
      efficient_stressed: userData.derived_features?.efficient_stressed || 0,
      consistent_weak: userData.derived_features?.consistent_weak || 0,
      repeater_penalty: userData.derived_features?.repeater_penalty || 0,
      family_support_strength: userData.derived_features?.family_support_strength || 0,
      kabylie_boost: userData.derived_features?.kabylie_boost || 0
    };

    // Create or update the result
    const result = await PrebacResult.findOneAndUpdate(
      { user_id: userId },
      {
        user_id: userId,
        filiere: userData.filiere,
        predicted_bac_avg: userData.predicted_bac_avg,
        cluster_id: userData.cluster_id || 0,
        archetype: userData.archetype || userData.cluster_name || 'مجهول',
        matched_student_id: userData.matched_student_id || null,
        match_similarity: userData.match_similarity || null,
        derived_features: derivedFeatures
      },
      { upsert: true, new: true, runValidators: true }
    );

    console.log('✅ Pre-BAC result saved for user:', userId);

    res.json({
      success: true,
      message: 'تم حفظ نتائج ما قبل البكالوريا بنجاح',
      data: result
    });

  } catch (error) {
    console.error('❌ Save Pre-BAC Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حفظ النتائج',
      error: error.message
    });
  }
};

// ============================================
// @route   GET /api/prebac/result
// @desc    Get saved pre-bac result for current user
// @access  Private (requires token)
// ============================================
const getResult = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('📊 Getting Pre-BAC result for user:', userId);

    const result = await PrebacResult.findOne({ user_id: userId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'لم تقم بإجراء تحليل ما قبل البكالوريا بعد'
      });
    }

    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('❌ Get Pre-BAC Result Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في جلب النتائج',
      error: error.message
    });
  }
};

// ============================================
// @route   DELETE /api/prebac/result
// @desc    Delete saved pre-bac result for current user
// @access  Private (requires token)
// ============================================
const deleteResult = async (req, res) => {
  try {
    const userId = req.user.id;

    console.log('🗑️ Deleting Pre-BAC result for user:', userId);

    const result = await PrebacResult.findOneAndDelete({ user_id: userId });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'لم تقم بإجراء تحليل ما قبل البكالوريا بعد'
      });
    }

    res.json({
      success: true,
      message: 'تم حذف نتائج ما قبل البكالوريا بنجاح'
    });

  } catch (error) {
    console.error('❌ Delete Pre-BAC Result Error:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في حذف النتائج',
      error: error.message
    });
  }
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
  predict,
  findMatch,
  getDerivedFeatures,
  saveResult,
  getResult,
  deleteResult
};