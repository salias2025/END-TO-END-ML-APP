// backend/src/routes/postbacRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
    predict,
    saveTop10,
    getResult,
    deleteResult
} = require('../controllers/postbacController');

// All routes require authentication
router.use(protect);

// POST /api/postbac/predict - Get domain predictions
router.post('/predict', predict);

// POST /api/postbac/save - Save top 10 recommendations
router.post('/save', saveTop10);

// GET /api/postbac/result - Get saved recommendations
router.get('/result', getResult);

// DELETE /api/postbac/result - Delete saved recommendations
router.delete('/result', deleteResult);

module.exports = router;