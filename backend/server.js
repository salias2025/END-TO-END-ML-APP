// backend/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');

// Import prebac service
const prebacService = require('./src/services/prebacService');

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CONNECT TO MONGODB
// ============================================
connectDB();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// ROUTES
// ============================================
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/prebac', require('./src/routes/prebacRoutes'));
app.use('/api/bacyear', require('./src/routes/bacYearRoutes'));
app.use('/api/postbac', require('./src/routes/postbacRoutes')); // ✅ ADDED Post-BAC routes

// ============================================
// HEALTH CHECK
// ============================================
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    dataLoaded: prebacService.getDataLoaded(),
    totalStudents: prebacService.getTotalStudents()
  });
});

// ============================================
// DATA STATUS ENDPOINT
// ============================================
app.get('/api/prebac/status', (req, res) => {
  res.json({
    success: true,
    dataLoaded: prebacService.getDataLoaded(),
    totalStudents: prebacService.getTotalStudents(),
    filieres: prebacService.FILIERE_NAMES || {}
  });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'المسار غير موجود'
  });
});

// ============================================
// START SERVER
// ============================================
const startServer = async () => {
  console.log('='.repeat(60));
  console.log('🚀 Starting server initialization...');
  console.log('='.repeat(60));

  console.log('\n📂 Loading pre-BAC data...');
  try {
    await prebacService.loadAllData();
    console.log('✅ Pre-BAC data loaded successfully!');
    console.log(`   👥 Total students: ${prebacService.getTotalStudents()}`);
  } catch (error) {
    console.error('❌ Failed to load pre-BAC data:', error.message);
    console.log('⚠️ Server will run with fallback mock data');
  }

  // Start the server
  app.listen(PORT, () => {
    console.log('\n' + '='.repeat(60));
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📁 Health check: http://localhost:${PORT}/api/health`);
    console.log(`📊 Data status: http://localhost:${PORT}/api/prebac/status`);
    console.log('='.repeat(60));
    console.log('\n📋 Available Endpoints:');
    console.log('─'.repeat(60));
    console.log('🔐 Auth routes:');
    console.log(`   POST   /api/auth/register - Register new user`);
    console.log(`   POST   /api/auth/login    - Login user`);
    console.log(`   GET    /api/auth/me       - Get user profile (private)`);
    console.log('\n📊 Pre-BAC routes:');
    console.log(`   POST   /api/prebac/predict  - Predict BAC & get cluster`);
    console.log(`   POST   /api/prebac/match    - Find closest matching student`);
    console.log(`   POST   /api/prebac/features - Calculate derived features`);
    console.log(`   GET    /api/prebac/health   - Pre-BAC service health check`);
    console.log(`   GET    /api/prebac/status   - Data loading status`);
    console.log('\n📊 BAC Year routes:');
    console.log(`   POST   /api/bacyear/:subject/predict  - Predict subject score`);
    console.log(`   POST   /api/bacyear/:subject/weaknesses  - Get weaknesses`);
    console.log(`   POST   /api/bacyear/:subject/features  - Get derived features`);
    console.log(`   POST   /api/bacyear/:subject/simulate  - Run simulation`);
    console.log(`   GET    /api/bacyear/:subject/result    - Get saved result`);
    console.log(`   GET    /api/bacyear/subjects           - List all subjects`);
    console.log('\n🎓 Post-BAC routes:');
    console.log(`   POST   /api/postbac/predict  - Get domain predictions & formations`);
    console.log(`   POST   /api/postbac/save     - Save top 10 recommendations`);
    console.log(`   GET    /api/postbac/result   - Get saved recommendations`);
    console.log(`   DELETE /api/postbac/result   - Delete saved recommendations`);
    console.log('\n📊 Data Status:');
    console.log(`   Data loaded: ${prebacService.getDataLoaded() ? '✅ YES' : '❌ NO'}`);
    console.log(`   Total students: ${prebacService.getTotalStudents()}`);
    console.log('='.repeat(60));
    console.log('\n✅ Server is ready! 🎉');
  });
};

// ============================================
// ERROR HANDLERS
// ============================================
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
});

// ============================================
// START
// ============================================
startServer();