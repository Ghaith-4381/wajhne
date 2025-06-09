
import express from 'express';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import { pool } from '../config/database.js';
import { CONFIG } from '../config/settings.js';
import { validateAdminCredentials, validateRegistrationData } from '../middleware/auth.js';

const router = express.Router();

// Email transporter setup
const transporter = nodemailer.createTransport({

  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Generate OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// API endpoint for admin login
router.post('/login', async (req, res) => {
  try {
    const { username, password1, password2, password3 } = req.body;

    // Validate input data
    const validationErrors = validateAdminCredentials(username, password1, password2, password3);
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: validationErrors.join(', ') 
      });
    }

    const conn = await pool.getConnection();

    try {
      const [users] = await conn.execute(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );

      if (users.length === 0) {
        return res.status(401).json({ 
          success: false, 
          message: 'اسم المستخدم أو كلمة المرور غير صحيحة' 
        });
      }

      const admin = users[0];

      // Verify passwords
      const isValid1 = await bcrypt.compare(password1, admin.password_hash);
      const isValid2 = await bcrypt.compare(password2, admin.password_hash_2);
      const isValid3 = await bcrypt.compare(password3, admin.password_hash_3);

      if (!isValid1 || !isValid2 || !isValid3) {
        return res.status(401).json({ 
          success: false, 
          message: 'اسم المستخدم أو كلمة المرور غير صحيحة' 
        });
      }

      // Update last login
      await conn.execute('UPDATE admins SET last_login = NOW() WHERE id = ?', [admin.id]);

      // Generate and store OTP
      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + CONFIG.OTP.EXPIRY_MINUTES * 60 * 1000);

      await conn.execute(
        'INSERT INTO admin_otps (admin_id, otp_code, expires_at) VALUES (?, ?, ?)',
        [admin.id, otp, expiresAt]
      );

      // Send email with OTP
      await transporter.sendMail({
        from: '"Click Admin Panel" <ghaithalmohammad@gmail.com>',
        to: admin.email,
        subject: 'رمز التحقق للدخول',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif;">
            <h2>رمز التحقق للدخول إلى لوحة التحكم</h2>
            <p>مرحباً ${admin.full_name},</p>
            <p>رمز التحقق الخاص بك هو:</p>
            <h1 style="background-color: #f0f0f0; padding: 20px; text-align: center; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
            <p><strong>ملاحظات هامة:</strong></p>
            <ul>
              <li>هذا الرمز صالح لمدة ${CONFIG.OTP.EXPIRY_MINUTES} دقائق فقط</li>
              <li>لا تشارك هذا الرمز مع أي شخص آخر</li>
              <li>إذا لم تطلب هذا الرمز، يرجى تجاهل هذه الرسالة</li>
            </ul>
          </div>
        `
      });

      return res.json({
        success: true,
        message: 'تم التحقق من كلمة المرور، وتم إرسال رمز إلى بريدك الإلكتروني',
        requireOtp: true,
        adminId: admin.id
      });

    } finally {
      conn.release();
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'خطأ في السيرفر' });
  }
});

// API endpoint to verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { adminId, otpCode } = req.body;

    if (!adminId || !otpCode) {
      return res.status(400).json({ success: false, message: 'رمز التحقق غير مكتمل' });
    }

    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        `SELECT * FROM admin_otps
         WHERE admin_id = ? AND otp_code = ? AND expires_at > NOW() AND verified = FALSE
         ORDER BY created_at DESC LIMIT 1`,
        [adminId, otpCode]
      );

      if (rows.length === 0) {
        return res.status(401).json({ success: false, message: 'رمز التحقق غير صحيح أو منتهي' });
      }

      await conn.execute(
        'UPDATE admin_otps SET verified = TRUE WHERE id = ?',
        [rows[0].id]
      );

      return res.json({ success: true, message: 'تم التحقق بنجاح، مرحبًا بك!' });
    } finally {
      conn.release();
    }

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ success: false, message: 'خطأ أثناء التحقق من الرمز' });
  }
});

// API endpoint to register a new admin
router.post('/register', async (req, res) => {
  try {
    const { username, password1, password2, password3, fullName, email, secretKey } = req.body;

    // Verify secret key
    if (secretKey !== process.env.ADMIN_REGISTER_SECRET) {
      return res.status(403).json({
        success: false,
        message: 'غير مصرح بالتسجيل - المفتاح السري غير صحيح'
      });
    }

    // Validate registration data
    const validationErrors = validateRegistrationData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: validationErrors.join(', ')
      });
    }

    const conn = await pool.getConnection();

    try {
      // Check if username already exists
      const [existingUsers] = await conn.execute(
        'SELECT * FROM admins WHERE username = ?',
        [username]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'اسم المستخدم موجود مسبقًا'
        });
      }

      // Hash passwords
      const passwordHash1 = await bcrypt.hash(password1, CONFIG.PASSWORD.SALT_ROUNDS);
      const passwordHash2 = await bcrypt.hash(password2, CONFIG.PASSWORD.SALT_ROUNDS);
      const passwordHash3 = await bcrypt.hash(password3, CONFIG.PASSWORD.SALT_ROUNDS);

      // Insert new admin
      await conn.execute(
        `INSERT INTO admins (
          username, password_hash, password_hash_2, password_hash_3,
          full_name, email, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [username, passwordHash1, passwordHash2, passwordHash3, fullName, email]
      );

      // Send welcome email
      await transporter.sendMail({
        from: '"Click Admin Panel" <ghaithalmohammad@gmail.com>',
        to: email,
        subject: 'مرحباً بك في لوحة تحكم التحدي',
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif;">
            <h2>مرحباً بك ${fullName}!</h2>
            <p>تم إنشاء حسابك بنجاح في لوحة تحكم التحدي.</p>
            <p><strong>بيانات حسابك:</strong></p>
            <ul>
              <li>اسم المستخدم: ${username}</li>
              <li>البريد الإلكتروني: ${email}</li>
            </ul>
            <p>يمكنك الآن تسجيل الدخول باستخدام كلمات المرور الثلاث التي قمت بتعيينها.</p>
          </div>
        `
      });

      return res.json({
        success: true,
        message: 'تم إنشاء حساب المدير بنجاح وتم إرسال بريد ترحيبي'
      });

    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error in admin registration:', error);
    res.status(500).json({
      success: false,
      message: 'حدث خطأ في السيرفر أثناء إنشاء الحساب'
    });
  }
});

// GET challenge settings
router.get('/challenge-settings', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    const [rows] = await conn.execute('SELECT * FROM challenge_settings ORDER BY id DESC LIMIT 1');
    conn.release();

    if (rows.length === 0) {
      return res.json({ success: true, data: null, message: 'لا توجد إعدادات حالياً' });
    }

    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching challenge settings:', error);
    res.status(500).json({ success: false, message: 'خطأ في جلب الإعدادات' });
  }
});

// POST (create/update) challenge settings
router.post('/challenge-settings', async (req, res) => {
  const { name, start_time, end_time, is_active } = req.body;

  if (!name || !start_time || !end_time) {
    return res.status(400).json({ success: false, message: 'جميع الحقول مطلوبة' });
  }

  try {
    const conn = await pool.getConnection();

    // تحقق إذا كانت هناك إعدادات موجودة
    const [existing] = await conn.execute('SELECT id FROM challenge_settings ORDER BY id DESC LIMIT 1');

    if (existing.length > 0) {
      // تحديث السجل الأخير
      await conn.execute(
        `UPDATE challenge_settings 
         SET name = ?, start_time = ?, end_time = ?, is_active = ?, updated_at = NOW() 
         WHERE id = ?`,
        [name, start_time, end_time, is_active ?? true, existing[0].id]
      );
    } else {
      // إنشاء إعدادات جديدة
      await conn.execute(
        `INSERT INTO challenge_settings (name, start_time, end_time, is_active) 
         VALUES (?, ?, ?, ?)`,
        [name, start_time, end_time, is_active ?? true]
      );
    }

    conn.release();
    res.json({ success: true, message: 'تم حفظ إعدادات التحدي بنجاح' });

  } catch (error) {
    console.error('Error saving challenge settings:', error);
    res.status(500).json({ success: false, message: 'فشل في حفظ الإعدادات' });
  }
});
export default router;
