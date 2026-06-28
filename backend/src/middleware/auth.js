// backend/src/middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;

    // 1. Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 2. Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'غير مصرح: يرجى تسجيل الدخول'
      });
    }

    // 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Get user from token
    const user = await User.findById(decoded.id).select('-password_hash');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'المستخدم غير موجود'
      });
    }

    // 5. Attach user to request
    req.user = user;
    next();

  } catch (error) {
    console.error('Auth Middleware Error:', error);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'رمز غير صالح'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'انتهت صلاحية الرمز، يرجى تسجيل الدخول مرة أخرى'
      });
    }

    res.status(500).json({
      success: false,
      message: 'حدث خطأ في التحقق من الهوية'
    });
  }
};

module.exports = { protect };