// backend/src/models/PrebacResult.js
const mongoose = require('mongoose');

const derivedFeaturesSchema = new mongoose.Schema({
  study_efficiency: Number,
  grinder_index: Number,
  time_allocation_ratio: Number,
  resource_reliance: Number,
  improvement_momentum: Number,
  grade_volatility: Number,
  stress_performance_ratio: Number,
  sleep_debt: Number,
  health_stress_index: Number,
  weakness_count: Number,
  problem_solving_gap: Number,
  weakness_concentration: Number,
  science_lang_gap: Number,
  subject_balance: Number,
  filiere_alignment: Number,
  efficient_stressed: Number,
  consistent_weak: Number,
  repeater_penalty: Number,
  family_support_strength: Number,
  kabylie_boost: Number
}, { _id: false });  // No separate _id for subdocument

const prebacResultsSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true  // One pre-bac result per user
  },
  filiere: {
    type: String,
    required: true
  },
  predicted_bac_avg: {
    type: Number,
    required: true,
    min: 0,
    max: 20
  },
  cluster_id: {
    type: Number,
    required: true
  },
  archetype: {
    type: String,
    required: true
  },
  matched_student_id: Number,
  match_similarity: {
    type: Number,
    min: 0,
    max: 1
  },
  derived_features: {
    type: derivedFeaturesSchema,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes
prebacResultsSchema.index({ user_id: 1 }, { unique: true });
prebacResultsSchema.index({ filiere: 1 });

const PrebacResult = mongoose.model('PrebacResult', prebacResultsSchema);
module.exports = PrebacResult;