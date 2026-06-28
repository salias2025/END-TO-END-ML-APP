// backend/src/routes/bacYearRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    predict,
    getWeaknesses,
    getDerivedFeatures,
    simulate,
    getMyResult,
    getAllUserResults
} = require('../controllers/bacYearController');

// ALL routes require authentication
router.use(protect);

// ============================================
// ✅ FIXED: Dynamic routes with :subject parameter
// ============================================

// POST /api/bacyear/:subject/predict
router.post('/:subject/predict', predict);

// POST /api/bacyear/:subject/weaknesses
router.post('/:subject/weaknesses', getWeaknesses);

// POST /api/bacyear/:subject/features
router.post('/:subject/features', getDerivedFeatures);

// POST /api/bacyear/:subject/simulate
router.post('/:subject/simulate', simulate);

// GET /api/bacyear/:subject/result
router.get('/:subject/result', getMyResult);

// ============================================
// GET /api/bacyear/results - Get all user results
// ============================================
router.get('/results', getAllUserResults);  // ← ADD THIS

// ============================================
// GET /api/bacyear/subjects - List all subjects
// ============================================
router.get('/subjects', (req, res) => {
    const subjects = [
        'arabic', 'maths', 'physics', 'science', 'french', 'english',
        'history_geo', 'islamia', 'philosophy', 'technology', 'tamazight',
        'foreign_languages', 'droit', 'eco_management', 'gestion'
    ];
    
    res.json({
        success: true,
        data: subjects.map(s => ({
            id: s,
            name: getSubjectName(s)
        }))
    });
});

// ============================================
// HELPER
// ============================================
function getSubjectName(id) {
    const names = {
        arabic: 'اللغة العربية',
        maths: 'الرياضيات',
        physics: 'الفيزياء',
        science: 'العلوم الطبيعية',
        french: 'اللغة الفرنسية',
        english: 'اللغة الإنجليزية',
        history_geo: 'التاريخ والجغرافيا',
        islamia: 'التربية الإسلامية',
        philosophy: 'الفلسفة',
        technology: 'التكنولوجيا',
        tamazight: 'الأمازيغية',
        foreign_languages: 'اللغات الأجنبية',
        droit: 'القانون',
        eco_management: 'الاقتصاد والتسيير',
        gestion: 'التسيير'
    };
    return names[id] || id;
}

module.exports = router;