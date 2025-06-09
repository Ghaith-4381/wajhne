import rateLimit from 'express-rate-limit';
import { CONFIG } from '../config/settings.js';

// Rate limiter to prevent brute-force attacks
export const createRateLimiter = () => rateLimit({
  windowMs: CONFIG.RATE_LIMIT.WINDOW_MS,
  max: CONFIG.RATE_LIMIT.MAX_REQUESTS,
  message: { 
    success: false, 
    message: 'Too many requests, please try again later.' 
  }
});

// IP restriction middleware for admin routes - تم تعطيله مؤقتاً
export const restrictToAllowedIPs = (req, res, next) => {
  // تم تعطيل فحص IP للسماح لجميع المستخدمين بالوصول
  console.log("IP restriction disabled - allowing all IPs");
  next();
  
  // الكود القديم معطل:
  /*
  const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  const ip = clientIP.includes('::ffff:') ? clientIP.split('::ffff:')[1] : clientIP;

  console.log("Client IP trying to access:", ip);

  if (!CONFIG.ALLOWED_IPS.includes(ip)) {
    return res.status(403).json({ 
      success: false, 
      message: 'Access denied: IP not allowed' 
    });
  }

  next();
  */
};

// Admin authentication notes and validation
export const validateAdminCredentials = (username, password1, password2, password3) => {
  const errors = [];
  
  if (!username || username.trim().length < 3) {
    errors.push('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
  }
  
  if (!password1 || password1.length < CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push(`كلمة المرور الأولى يجب أن تكون ${CONFIG.PASSWORD.MIN_LENGTH} أحرف على الأقل`);
  }
  
  if (!password2 || password2.length < CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push(`كلمة المرور الثانية يجب أن تكون ${CONFIG.PASSWORD.MIN_LENGTH} أحرف على الأقل`);
  }
  
  if (!password3 || password3.length < CONFIG.PASSWORD.MIN_LENGTH) {
    errors.push(`كلمة المرور الثالثة يجب أن تكون ${CONFIG.PASSWORD.MIN_LENGTH} أحرف على الأقل`);
  }
  
  return errors;
};

// Registration validation
export const validateRegistrationData = (data) => {
  const { username, password1, password2, password3, email, fullName } = data;
  const errors = [];
  
  // Username validation
  if (!username || username.trim().length < 3) {
    errors.push('اسم المستخدم يجب أن يكون 3 أحرف على الأقل');
  }
  
  // Password validation
  const passwordErrors = validateAdminCredentials(username, password1, password2, password3);
  errors.push(...passwordErrors);
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('البريد الإلكتروني غير صالح');
  }
  
  // Full name validation
  if (!fullName || fullName.trim().length < 2) {
    errors.push('الاسم الكامل يجب أن يكون حرفين على الأقل');
  }
  
  return errors;
};
