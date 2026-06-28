// backend/src/models/PostbacTop10.js
const mongoose = require('mongoose');

const top10ItemSchema = new mongoose.Schema({
  rank: { type: Number, required: true, min: 1, max: 10 },
  specialty: { type: String, required: true },
  university: { type: String, required: true },
  score: { type: Number, required: true, min: 0, max: 100 },
  domain: String,
  description: String
}, { _id: false });

const postbacTop10Schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  top_10: [top10ItemSchema]
}, {
  timestamps: true
});

// Indexes
postbacTop10Schema.index({ user_id: 1 });
postbacTop10Schema.index({ created_at: -1 });

const PostbacTop10 = mongoose.model('PostbacTop10', postbacTop10Schema);
module.exports = PostbacTop10;