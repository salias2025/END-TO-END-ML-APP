// backend/src/models/BacYearResult.js
const mongoose = require('mongoose');

// ============================================
// WEAKNESS VECTOR SCHEMA (Full details)
// ============================================
const skillWeaknessSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  current: { type: Number, required: true },
  target: { type: Number, required: true },
  gap: { type: Number, required: true },
  name: { type: String, required: true }
}, { _id: false });

const habitWeaknessSchema = new mongoose.Schema({
  habit: { type: String, required: true },
  current: { type: Number, required: true },
  target: { type: Number, required: true },
  gap: { type: Number, required: true }
}, { _id: false });

const strengthSchema = new mongoose.Schema({
  skill: { type: String, required: true },
  value: { type: Number, required: true },
  excess: { type: Number, required: true }
}, { _id: false });

const weaknessVectorSchema = new mongoose.Schema({
  weakness_score: { type: Number, min: 0, max: 100, default: 0 },
  skill_weaknesses: [skillWeaknessSchema],
  habit_weaknesses: [habitWeaknessSchema],
  strengths: [strengthSchema],
  stress_high: { type: Boolean, default: false },
  recommendations: { type: [String], default: [] }
}, { _id: false });

// ============================================
// DERIVED FEATURES SCHEMA (Subject-specific)
// ============================================
const derivedFeaturesSchema = new mongoose.Schema({
  language_core: { type: Number, default: 0 },
  writing_score: { type: Number, default: 0 },
  analysis_score: { type: Number, default: 0 },
  practice_intensity: { type: Number, default: 0 },
  skill_balance: { type: Number, default: 0 }
}, { _id: false });

// ============================================
// SUBJECT SCHEMA (One per subject)
// ============================================
const subjectSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: true,
    enum: ['arabic', 'maths', 'physics', 'science', 'french', 'english',
           'his_geo', 'islamia', 'philo', 'techno', 'tamazight',
           'langue_etrangere', 'droit', 'economie', 'gestion']
  },
  subject_name: {
    type: String,
    required: true
  },
  predicted_score: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  success_probability: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  improvement_potential: {
    type: Number,
    min: 0,
    max: 10,
    default: 0
  },
  // ✅ Full weakness vector
  weakness_vector: {
    type: weaknessVectorSchema,
    default: () => ({})
  },
  // ✅ Subject-specific derived features
  derived_features: {
    type: derivedFeaturesSchema,
    default: () => ({})
  },
  // ✅ Input data for reference
  input_data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
}, { _id: false });

// ============================================
// SUMMARY SCHEMA (Overall stats)
// ============================================
const summarySchema = new mongoose.Schema({
  total_subjects: { type: Number, default: 0 },
  avg_score: { type: Number, default: 0 },
  weighted_avg: { type: Number, default: 0 },
  weak_subjects: { type: [String], default: [] },
  strong_subjects: { type: [String], default: [] },
  weakest_subject: { type: String, default: '' },
  strongest_subject: { type: String, default: '' },
  weakness_count: { type: Number, default: 0 },
  risk_level: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'low'
  },
  risk_score: { type: Number, default: 0 }
}, { _id: false });

// ============================================
// CROSS-SUBJECT DERIVED FEATURES
// ============================================
const crossSubjectDerivedSchema = new mongoose.Schema({
  subject_balance: { type: Number, default: 0 },
  consistency_score: { type: Number, default: 0 },
  improvement_from_prebac: { type: Number, default: 0 },
  predicted_mention: {
    type: String,
    enum: ['ممتاز', 'جيد جداً', 'جيد', 'مقبول', 'ناجح', 'راسب'],
    default: 'مقبول'
  }
}, { _id: false });

// ============================================
// MAIN BAC YEAR RESULT SCHEMA
// ============================================
const bacYearResultSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  filiere: {
    type: String,
    required: true
  },
  // ✅ Array of all subject results
  subjects: [subjectSchema],
  // ✅ Overall summary
  summary: {
    type: summarySchema,
    default: () => ({})
  },
  // ✅ Cross-subject derived features
  derived_features: {
    type: crossSubjectDerivedSchema,
    default: () => ({})
  }
}, {
  timestamps: true
});

// ============================================
// INDEXES
// ============================================
bacYearResultSchema.index({ user_id: 1 });
bacYearResultSchema.index({ username: 1 });
bacYearResultSchema.index({ 'subjects.subject': 1 });
bacYearResultSchema.index({ filiere: 1 });

// ============================================
// MODEL
// ============================================
const BacYearResult = mongoose.model('BacYearResult', bacYearResultSchema);
module.exports = BacYearResult;