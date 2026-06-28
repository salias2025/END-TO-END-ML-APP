// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

// ============================================
// PUBLIC ROUTES
// ============================================
router.post('/register', register);
router.post('/login', login);

// ============================================
// PRIVATE ROUTES (require authentication)
// ============================================
router.get('/me', protect, getMe);

module.exports = router;