// backend/src/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ============================================
// GENERATE JWT TOKEN
// ============================================
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

// ============================================
// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
// ============================================
const register = async (req, res) => {
  try {
    // Log the entire request body
    console.log('='.repeat(60));
    console.log('📝 REGISTER REQUEST RECEIVED');
    console.log('📝 Request Body:', JSON.stringify(req.body, null, 2));

    const { fullname, username, password, filiere, bac_year } = req.body;

    // Log each field separately
    console.log('📝 fullname:', fullname);
    console.log('📝 username:', username);
    console.log('📝 password:', password);
    console.log('📝 filiere:', filiere);
    console.log('📝 bac_year:', bac_year);

    // ===== VALIDATION =====
    if (!fullname || !username || !password || !filiere) {
      console.log('❌ Validation failed: Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'جميع الحقول مطلوبة: الاسم الكامل، اسم المستخدم، كلمة المرور، الشعبة'
      });
    }

    // ===== PASSWORD REQUIREMENTS =====
    if (password.length < 8) {
      console.log('❌ Password too short:', password.length);
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
      });
    }
    if (!/[A-Z]/.test(password)) {
      console.log('❌ Password missing capital letter');
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تحتوي على حرف كبير واحد على الأقل'
      });
    }
    if (!/[0-9]/.test(password)) {
      console.log('❌ Password missing number');
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تحتوي على رقم واحد على الأقل'
      });
    }
    if (!/[!@#$%^&*()_+\-=[\]{};:'"\\|,.<>/?]/.test(password)) {
      console.log('❌ Password missing special character');
      return res.status(400).json({
        success: false,
        message: 'كلمة المرور يجب أن تحتوي على رمز خاص واحد على الأقل (!@#$%^&*)'
      });
    }
    console.log('✅ Password validation passed');

    // ===== CHECK IF USER EXISTS =====
    console.log('🔍 Checking if username exists:', username.toLowerCase());
    const existingUser = await User.findOne({ username: username.toLowerCase() });
    if (existingUser) {
      console.log('❌ Username already exists:', username);
      return res.status(400).json({
        success: false,
        message: 'اسم المستخدم موجود بالفعل، يرجى اختيار اسم آخر'
      });
    }
    console.log('✅ Username is available');

    // ===== CREATE USER =====
    console.log('👤 Creating user...');
    const user = await User.create({
      fullname,
      username: username.toLowerCase(),
      password_hash: password,
      filiere,
      bac_year: bac_year || '2026'
    });
    console.log('✅ User created successfully!');
    console.log('📝 User ID:', user._id);
    console.log('📝 Username:', user.username);

    // ===== GENERATE TOKEN =====
    const token = generateToken(user._id);
    console.log('✅ Token generated successfully');

    // ===== RETURN RESPONSE =====
    console.log('📤 Sending success response');
    console.log('='.repeat(60));
    
    res.status(201).json({
      success: true,
      message: 'تم إنشاء الحساب بنجاح',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.log('='.repeat(60));
    console.log('❌❌❌ ERROR CAUGHT! ❌❌❌');
    console.log('Error Name:', error.name);
    console.log('Error Message:', error.message);
    console.log('Error Stack:', error.stack);
    console.log('Full Error:', JSON.stringify(error, null, 2));
    console.log('='.repeat(60));
    
    res.status(500).json({
      success: false,
      message: error.message || 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى',
      error: error.message // Include the error for debugging
    });
  }
};

// ============================================
// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
// ============================================
const login = async (req, res) => {
  try {
    console.log('='.repeat(60));
    console.log('📝 LOGIN REQUEST RECEIVED');
    console.log('📝 Request Body:', JSON.stringify(req.body, null, 2));

    const { username, password } = req.body;

    if (!username || !password) {
      console.log('❌ Missing username or password');
      return res.status(400).json({
        success: false,
        message: 'اسم المستخدم وكلمة المرور مطلوبان'
      });
    }

    console.log('🔍 Finding user:', username.toLowerCase());
    const user = await User.findOne({ username: username.toLowerCase() }).select('+password_hash');
    
    if (!user) {
      console.log('❌ User not found:', username);
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }
    console.log('✅ User found');

    console.log('🔍 Comparing password...');
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('❌ Password does not match');
      return res.status(401).json({
        success: false,
        message: 'اسم المستخدم أو كلمة المرور غير صحيحة'
      });
    }
    console.log('✅ Password matches');

    const token = generateToken(user._id);
    console.log('✅ Token generated');

    console.log('📤 Sending login success response');
    console.log('='.repeat(60));

    res.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
      token,
      user: user.toJSON()
    });

  } catch (error) {
    console.log('='.repeat(60));
    console.log('❌❌❌ LOGIN ERROR ❌❌❌');
    console.log('Error:', error.message);
    console.log('='.repeat(60));
    
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم، يرجى المحاولة مرة أخرى'
    });
  }
};

// ============================================
// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private (requires token)
// ============================================
const getMe = async (req, res) => {
  try {
    console.log('📝 GET ME REQUEST');
    console.log('User ID:', req.user.id);

    const user = await User.findById(req.user.id);
    
    if (!user) {
      console.log('❌ User not found');
      return res.status(404).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    console.log('✅ User found');
    res.json({
      success: true,
      user: user.toJSON()
    });

  } catch (error) {
    console.log('❌ GetMe Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في الخادم'
    });
  }
};

module.exports = {
  register,
  login,
  getMe
};