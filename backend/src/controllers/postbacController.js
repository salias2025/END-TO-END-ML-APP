// backend/src/controllers/postbacController.js
const postbacService = require('../services/postbacService');
const PostbacTop10 = require('../models/PostbacTop10');

// ============================================
// @route   POST /api/postbac/predict
// @desc    Predict domains and get recommendations
// @access  Private
// ============================================
const predict = async (req, res) => {
    try {
        const userId = req.user.id;
        const studentData = req.body;

        console.log('📝 Post-BAC Prediction Request:', studentData);

        // Validate required fields
        if (!studentData.bac_stream || !studentData.bac_avg) {
            return res.status(400).json({
                success: false,
                message: 'Filière BAC et moyenne sont requises'
            });
        }

        // Load models
        postbacService.loadModels();

        // Predict
        const result = await postbacService.predictDomains(studentData);

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('❌ Post-BAC Prediction Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في تحليل التوجيه',
            error: error.message
        });
    }
};

// ============================================
// @route   POST /api/postbac/save
// @desc    Save top 10 recommendations
// @access  Private
// ============================================
const saveTop10 = async (req, res) => {
    try {
        const userId = req.user.id;
        const { top_10 } = req.body;

        console.log('💾 Saving Post-BAC Top 10 for user:', userId);

        if (!top_10 || !Array.isArray(top_10) || top_10.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Top 10 formations sont requises'
            });
        }

        // Validate each item
        for (const item of top_10) {
            if (!item.rank || !item.specialty || !item.university) {
                return res.status(400).json({
                    success: false,
                    message: 'Chaque formation doit avoir: rank, specialty, university'
                });
            }
        }

        // Save or update
        const result = await PostbacTop10.findOneAndUpdate(
            { user_id: userId },
            { user_id: userId, top_10: top_10 },
            { upsert: true, new: true }
        );

        res.json({
            success: true,
            message: 'Top 10 formations sauvegardées avec succès',
            data: result
        });

    } catch (error) {
        console.error('❌ Save Post-BAC Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في حفظ التوصيات',
            error: error.message
        });
    }
};

// ============================================
// @route   GET /api/postbac/result
// @desc    Get saved top 10 recommendations
// @access  Private
// ============================================
const getResult = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log('📊 Getting Post-BAC result for user:', userId);

        const result = await PostbacTop10.findOne({ user_id: userId });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'لم تقم بحفظ توصيات التوجيه بعد'
            });
        }

        res.json({
            success: true,
            data: result
        });

    } catch (error) {
        console.error('❌ Get Post-BAC Result Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في جلب التوصيات',
            error: error.message
        });
    }
};

// ============================================
// @route   DELETE /api/postbac/result
// @desc    Delete saved recommendations
// @access  Private
// ============================================
const deleteResult = async (req, res) => {
    try {
        const userId = req.user.id;

        console.log('🗑️ Deleting Post-BAC result for user:', userId);

        const result = await PostbacTop10.findOneAndDelete({ user_id: userId });

        if (!result) {
            return res.status(404).json({
                success: false,
                message: 'لم تقم بحفظ توصيات التوجيه بعد'
            });
        }

        res.json({
            success: true,
            message: 'تم حذف توصيات التوجيه بنجاح'
        });

    } catch (error) {
        console.error('❌ Delete Post-BAC Result Error:', error);
        res.status(500).json({
            success: false,
            message: 'حدث خطأ في حذف التوصيات',
            error: error.message
        });
    }
};

module.exports = {
    predict,
    saveTop10,
    getResult,
    deleteResult
};