// backend/src/routes/prebacRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { 
  predict, 
  findMatch, 
  getDerivedFeatures,
  saveResult,
  getResult,
  deleteResult
} = require('../controllers/prebacController');

// ============================================
// ALL ROUTES REQUIRE AUTHENTICATION
// ============================================
router.use(protect);

// ============================================
// PRE-BAC ROUTES
// ============================================

// POST /api/prebac/predict - Get BAC prediction and cluster info
router.post('/predict', predict);

// POST /api/prebac/match - Find closest matching student
router.post('/match', findMatch);

// POST /api/prebac/features - Calculate derived features only
router.post('/features', getDerivedFeatures);

// POST /api/prebac/save - Save results to database
router.post('/save', saveResult);

// GET /api/prebac/result - Get saved results for current user
router.get('/result', getResult);

// DELETE /api/prebac/result - Delete saved results for current user
router.delete('/result', deleteResult);

// GET /api/prebac/health - Health check for pre-bac service
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Pre-BAC service is running',
    timestamp: new Date().toISOString()
  });
});

// GET /api/prebac/status - Get data loading status
router.get('/status', (req, res) => {
  const prebacService = require('../services/prebacService');
  res.json({
    success: true,
    data: {
      loaded: prebacService.getDataLoaded(),
      totalStudents: prebacService.getTotalStudents(),
      filieres: prebacService.getFiliereCounts()
    }
  });
});

module.exports = router;