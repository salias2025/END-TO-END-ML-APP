// backend/src/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'الاسم الكامل مطلوب'],
    trim: true
  },
  username: {
    type: String,
    required: [true, 'اسم المستخدم مطلوب'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل']
  },
  password_hash: {
    type: String,
    required: [true, 'كلمة المرور مطلوبة'],
    select: false
  },
  filiere: {
    type: String,
    required: [true, 'الشعبة مطلوبة'],
    enum: [
      'sciences_experimentales',
      'maths',
      'techniques_maths',
      'gestion_economie',
      'langues_etrangeres',
      'lettres_philosophie'
    ]
  },
  bac_year: {
    type: String,
    default: '2026'
  }
}, {
  timestamps: true
});

// ============================================
// PRE-SAVE MIDDLEWARE: Hash password
// FIXED: Removed 'next' parameter and used async/await properly
// ============================================
userSchema.pre('save', async function() {
  // Only hash if password is modified
  if (!this.isModified('password_hash')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password_hash = await bcrypt.hash(this.password_hash, salt);
  } catch (error) {
    throw error; // Let mongoose handle the error
  }
});

// ============================================
// INSTANCE METHOD: Compare password
// ============================================
userSchema.methods.comparePassword = async function(candidatePassword) {
  console.log('🔐 Comparing passwords:');
  console.log('📝 Candidate password:', candidatePassword);
  console.log('📝 Stored hash:', this.password_hash ? this.password_hash.substring(0, 30) + '...' : 'MISSING');
  
  if (!this.password_hash) {
    console.log('❌ No password hash found!');
    return false;
  }
  
  // Check if the stored password is a bcrypt hash (starts with $2b$ or $2a$)
  if (this.password_hash.startsWith('$2b$') || this.password_hash.startsWith('$2a$')) {
    // It's a hash - use bcrypt.compare
    console.log('📝 Stored password is a bcrypt hash');
    const isMatch = await bcrypt.compare(candidatePassword, this.password_hash);
    console.log('📝 Match result:', isMatch);
    return isMatch;
  } else {
    // It's plain text - compare directly
    console.log('📝 Stored password is plain text - comparing directly');
    const isMatch = this.password_hash === candidatePassword;
    console.log('📝 Match result:', isMatch);
    return isMatch;
  }
};

// ============================================
// VIRTUAL: Return user without password
// ============================================
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password_hash;
  return user;
};

// ============================================
// INDEXES
// ============================================
// REMOVED duplicate username index (unique is already defined in schema)
userSchema.index({ filiere: 1 });

const User = mongoose.model('User', userSchema);
module.exports = User;