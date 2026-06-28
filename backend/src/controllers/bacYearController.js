// backend/src/controllers/bacYearController.js

const bacYearService = require('../services/bacYearService');
const BacYearResult = require('../models/BacYearResult');

// ============================================
// HELPER: Get subject display name
// ============================================
const getSubjectName = (subject) => {
    const names = {
        arabic: 'اللغة العربية',
        maths: 'الرياضيات',
        physics: 'الفيزياء',
        science: 'العلوم الطبيعية',
        french: 'اللغة الفرنسية',
        english: 'اللغة الإنجليزية',
        history_geo: 'التاريخ والجغرافيا',
        islamia: 'التربية الإسلامية',
        philo: 'الفلسفة',
        technology: 'التكنولوجيا',
        tamazight: 'الأمازيغية',
        foreign_languages: 'اللغات الأجنبية',
        droit: 'القانون',
        eco_management: 'الاقتصاد والتسيير',
        gestion: 'التسيير'
    };
    return names[subject] || subject;
};

// ============================================
// 1. PREDICT
// ============================================
const predict = async (req, res) => {
    try {
        const { subject } = req.params;
        const userData = req.body;
        const userId = req.user.id;
        const username = req.user.username || req.user.email || 'user';

        console.log(`📝 ${subject} Prediction Request for ${username}:`, userData);

        // Validate required fields
        const requiredFields = ['grade_t1', 'grade_t2', 'grade_t3'];
        for (const field of requiredFields) {
            if (userData[field] === undefined || userData[field] === null) {
                return res.status(400).json({
                    success: false,
                    message: `الحقل ${field} مطلوب`
                });
            }
        }

        // Load model
        await bacYearService.loadModel(subject);

        // Predict
        const prediction = await bacYearService.predict(subject, userData);

        // Calculate derived features - PASS THE SUBJECT!
        const derivedFeatures = bacYearService.calculateDerivedFeatures(subject, userData);

        // Analyze weaknesses
        const weaknessAnalysis = bacYearService.analyzeWeaknesses(userData, subject);

        // Save to database
        try {
            const subjectName = getSubjectName(subject);
            await saveResult(
                userId,
                username,
                subject,
                subjectName,
                userData,
                prediction,
                derivedFeatures,
                weaknessAnalysis
            );
            console.log(`✅ Saved ${subject} result for user ${username}`);
        } catch (dbError) {
            console.error('❌ Database save error:', dbError);
        }

        res.json({
            success: true,
            data: {
                prediction: prediction,
                derived_features: derivedFeatures,
                weaknesses: weaknessAnalysis,
                subject: subject
            }
        });

    } catch (error) {
        console.error('❌ Prediction Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في التنبؤ',
            error: error.message
        });
    }
};

// ============================================
// 2. GET WEAKNESSES
// ============================================
const getWeaknesses = async (req, res) => {
    try {
        const { subject } = req.params;
        const userData = req.body;

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء تحديد المادة'
            });
        }

        const weaknesses = bacYearService.analyzeWeaknesses(userData, subject);

        res.json({
            success: true,
            data: weaknesses
        });

    } catch (error) {
        console.error('❌ Weaknesses Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في تحليل نقاط الضعف'
        });
    }
};

// ============================================
// 3. GET DERIVED FEATURES
// ============================================
const getDerivedFeatures = async (req, res) => {
    try {
        const { subject } = req.params;
        const userData = req.body;

        // PASS THE SUBJECT!
        const features = bacYearService.calculateDerivedFeatures(subject, userData);

        res.json({
            success: true,
            data: features
        });

    } catch (error) {
        console.error('❌ Features Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في حساب المؤشرات المشتقة'
        });
    }
};

// ============================================
// 4. SIMULATE - ✅ FIXED: Pass subject
// ============================================
const simulate = async (req, res) => {
    try {
        const { subject } = req.params;
        const userData = req.body;
        const { improvements } = req.body;
        const { prediction } = req.body;

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء تحديد المادة'
            });
        }

        if (!improvements) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء تحديد التحسينات المطلوبة'
            });
        }

        // ✅ FIXED: Pass subject!
        const result = bacYearService.simulateImprovement(subject, userData, improvements, prediction);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('❌ Simulation Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في المحاكاة'
        });
    }
};

// ============================================
// 5. GET RESULT (for user)
// ============================================
const getMyResult = async (req, res) => {
    try {
        const userId = req.user.id;
        const { subject } = req.params;

        if (!subject) {
            return res.status(400).json({
                success: false,
                message: 'الرجاء تحديد المادة'
            });
        }

        const result = await BacYearResult.findOne({ user_id: userId });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'لم تقم بإجراء التحليل بعد'
            });
        }

        const subjectData = result.subjects.find(s => s.subject === subject);

        res.json({
            success: true,
            data: {
                result: result,
                subject_data: subjectData || null
            }
        });

    } catch (error) {
        console.error('❌ Get Result Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب النتائج'
        });
    }
};

// ============================================
// 6. GET ALL RESULTS (for user)
// ============================================
const getAllResults = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await BacYearResult.findOne({ user_id: userId });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'لم تقم بإجراء أي تحليل بعد'
            });
        }

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('❌ Get All Results Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب النتائج'
        });
    }
};

// ============================================
// 7. SAVE RESULT (helper)
// ============================================
const saveResult = async (userId, username, subject, subjectName, userData, prediction, derivedFeatures, weaknessAnalysis) => {
    let result = await BacYearResult.findOne({ user_id: userId });

    // Build derived features based on subject
    let derivedFeaturesToSave = {};

    if (subject === 'arabic') {
        derivedFeaturesToSave = {
            language_core: derivedFeatures.language_core || 0,
            writing_score: derivedFeatures.writing_score || 0,
            analysis_score: derivedFeatures.analysis_score || 0,
            practice_intensity: derivedFeatures.practice_intensity || 0,
            skill_balance: derivedFeatures.skill_balance || 0
        };
    } else if (subject === 'french') {
        derivedFeaturesToSave = {
            comprehension_score: derivedFeatures.comprehension_score || 0,
            argumentation_score: derivedFeatures.argumentation_score || 0,
            writing_score: derivedFeatures.writing_score || 0,
            practice_intensity: derivedFeatures.practice_intensity || 0,
            skill_balance: derivedFeatures.skill_balance || 0
        };
    } else if (subject === 'english') {
        derivedFeaturesToSave = {
            reading_score: derivedFeatures.reading_score_derived || 0,
            language_score: derivedFeatures.language_score_derived || 0,
            writing_score: derivedFeatures.writing_score_derived || 0,
            grammar_mastery: derivedFeatures.grammar_mastery || 0,
            vocabulary_score: derivedFeatures.vocabulary_score || 0,
            practice_intensity: derivedFeatures.practice_intensity_derived || 0,
            skill_balance: derivedFeatures.skill_balance || 0
        };
    } else if (subject === 'tamazight') {
        derivedFeaturesToSave = {
            language_core_score: derivedFeatures.language_core_score || 0,
            morphology_score: derivedFeatures.morphology_score || 0,
            reading_comprehension: derivedFeatures.reading_comprehension || 0,
            writing_score: derivedFeatures.writing_score || 0,
            cultural_heritage: derivedFeatures.cultural_heritage || 0,
            practice_intensity: derivedFeatures.practice_intensity || 0,
            skill_balance: derivedFeatures.skill_balance || 0,
            analysis_score: derivedFeatures.analysis_score || 0
        };
    } else if (subject === 'langue_etrangere') {
        derivedFeaturesToSave = {
            reading_score: derivedFeatures.reading_score || 0,
            linguistic_score: derivedFeatures.linguistic_score || 0,
            writing_score: derivedFeatures.writing_score || 0,
            grammar_mastery: derivedFeatures.grammar_mastery || 0,
            vocabulary_score: derivedFeatures.vocabulary_score || 0,
            practice_intensity: derivedFeatures.practice_intensity || 0,
            skill_balance: derivedFeatures.skill_balance || 0,
            overall_proficiency: derivedFeatures.overall_proficiency || 0
        };
    }

    const subjectResult = {
        subject: subject,
        subject_name: subjectName,
        predicted_score: prediction.predicted_score,
        success_probability: prediction.success_probability || 0,
        improvement_potential: prediction.improvement_potential || 0,
        weakness_vector: {
            weakness_score: weaknessAnalysis.weakness_score || 0,
            skill_weaknesses: weaknessAnalysis.skill_weaknesses || [],
            habit_weaknesses: weaknessAnalysis.habit_weaknesses || [],
            strengths: weaknessAnalysis.strengths || [],
            stress_high: weaknessAnalysis.stress_high || false,
            recommendations: weaknessAnalysis.recommendations || []
        },
        derived_features: derivedFeaturesToSave,
        input_data: userData,
        created_at: new Date(),
        updated_at: new Date()
    };

    if (!result) {
        result = new BacYearResult({
            user_id: userId,
            username: username,
            filiere: userData.filiere || 'sciences_experimentales',
            subjects: [subjectResult],
            summary: {
                total_subjects: 1,
                avg_score: prediction.predicted_score,
                weak_subjects: [],
                strong_subjects: [],
                weakest_subject: subject,
                strongest_subject: subject,
                weakness_count: 0,
                risk_level: 'low',
                risk_score: 0
            },
            derived_features: {
                subject_balance: 0,
                consistency_score: 0,
                improvement_from_prebac: 0,
                predicted_mention: getMention(prediction.predicted_score)
            }
        });
    } else {
        const existingIndex = result.subjects.findIndex(s => s.subject === subject);
        if (existingIndex !== -1) {
            result.subjects[existingIndex] = subjectResult;
        } else {
            result.subjects.push(subjectResult);
        }

        if (result.username !== username) {
            result.username = username;
        }

        if (result.filiere !== userData.filiere) {
            result.filiere = userData.filiere || 'sciences_experimentales';
        }

        await updateSummary(result);
        await updateDerivedFeatures(result);
    }

    await result.save();
    console.log(`✅ Saved ${subject} result for user ${username} (${userId})`);
};

// ============================================
// 8. UPDATE SUMMARY (helper)
// ============================================
const updateSummary = async (result) => {
    const subjects = result.subjects;
    const scores = [];
    const weak = [];
    const strong = [];

    for (const s of subjects) {
        if (s && s.predicted_score !== undefined) {
            scores.push({ subject: s.subject, score: s.predicted_score });
            if (s.predicted_score < 10) weak.push(s.subject);
            if (s.predicted_score >= 16) strong.push(s.subject);
        }
    }

    if (scores.length === 0) return;

    const avgScore = scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const sorted = scores.sort((a, b) => a.score - b.score);

    let riskLevel = 'low';
    let riskScore = 0;
    const weakCount = weak.length;
    const totalSubjects = scores.length;

    if (weakCount > totalSubjects * 0.5) {
        riskLevel = 'critical';
        riskScore = 80 + (weakCount / totalSubjects) * 20;
    } else if (weakCount > totalSubjects * 0.3) {
        riskLevel = 'high';
        riskScore = 60 + (weakCount / totalSubjects) * 20;
    } else if (weakCount > 0) {
        riskLevel = 'medium';
        riskScore = 40 + (weakCount / totalSubjects) * 20;
    } else {
        riskLevel = 'low';
        riskScore = Math.max(0, 20 - avgScore * 2);
    }

    result.summary = {
        total_subjects: totalSubjects,
        avg_score: Math.round(avgScore * 10) / 10,
        weighted_avg: Math.round(avgScore * 10) / 10,
        weak_subjects: weak,
        strong_subjects: strong,
        weakest_subject: sorted[0]?.subject || '',
        strongest_subject: sorted[sorted.length - 1]?.subject || '',
        weakness_count: weak.length,
        risk_level: riskLevel,
        risk_score: Math.round(riskScore * 10) / 10
    };
};

// ============================================
// 9. UPDATE DERIVED FEATURES (helper)
// ============================================
const updateDerivedFeatures = async (result) => {
    const subjects = result.subjects;
    const scores = subjects.map(s => s.predicted_score).filter(s => s !== undefined);

    if (scores.length === 0) return;

    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, val) => sum + Math.pow(val - avgScore, 2), 0) / scores.length;
    const subjectBalance = Math.sqrt(variance);

    const maxScore = Math.max(...scores);
    const minScore = Math.min(...scores);
    const consistencyScore = maxScore > 0 ? 1 - (maxScore - minScore) / maxScore : 0;

    result.derived_features = {
        subject_balance: Math.round(subjectBalance * 100) / 100,
        consistency_score: Math.round(consistencyScore * 100) / 100,
        improvement_from_prebac: 0,
        predicted_mention: getMention(avgScore)
    };
};

// ============================================
// 10. GET MENTION (helper)
// ============================================
const getMention = (score) => {
    if (score >= 18) return 'ممتاز';
    if (score >= 16) return 'جيد جداً';
    if (score >= 14) return 'جيد';
    if (score >= 12) return 'مقبول';
    if (score >= 10) return 'ناجح';
    return 'راسب';
};

// ============================================
// 11. GET ALL USER RESULTS (NEW!)
// ============================================
const getAllUserResults = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log(`📊 Getting all results for user: ${userId}`);

        const result = await BacYearResult.findOne({ user_id: userId });

        if (!result) {
            console.log(`⚠️ No results found for user: ${userId}`);
            return res.json({
                success: true,
                data: {}  // Empty object = no results yet
            });
        }

        // Build object with subject_id → prediction data
        const results = {};
        result.subjects.forEach(subject => {
            results[subject.subject] = {
                predicted_score: subject.predicted_score,
                success_probability: subject.success_probability,
                improvement_potential: subject.improvement_potential,
                subject_name: subject.subject_name
            };
        });

        console.log(`✅ Found ${Object.keys(results).length} subjects for user`);
        
        res.json({
            success: true,
            data: results
        });

    } catch (error) {
        console.error('❌ Get All Results Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب النتائج'
        });
    }
};

// ============================================
// EXPORTS
// ============================================
module.exports = {
    predict,
    getWeaknesses,
    getDerivedFeatures,
    simulate,
    getMyResult,
    getAllResults,
     getAllUserResults
};