import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// الحصول على قائمة المحظورين
router.get('/banned-list', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [banned] = await conn.execute(
        `SELECT *, 
         CASE 
           WHEN ban_type = 'permanent' THEN 'نهائي'
           WHEN expires_at > NOW() THEN 'مؤقت - نشط'
           ELSE 'مؤقت - منتهي'
         END as status_text
         FROM banned_ips 
         ORDER BY banned_at DESC`
      );
      res.json(banned);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في جلب قائمة المحظورين:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// إضافة حظر يدوي
router.post('/add-ban', async (req, res) => {
  try {
    const { ipAddress, country, banType, banReason, duration } = req.body;
    
    if (!ipAddress || !banType) {
      return res.status(400).json({ error: 'البيانات غير مكتملة' });
    }

    const conn = await pool.getConnection();
    try {
      let expiresAt = null;
      if (banType === 'temporary') {
        expiresAt = new Date(Date.now() + (duration || 30) * 60 * 1000);
      }

      await conn.execute(
        `INSERT INTO banned_ips (ip_address, country, ban_type, ban_reason, expires_at, banned_by_admin, is_active)
         VALUES (?, ?, ?, ?, ?, TRUE, TRUE)
         ON DUPLICATE KEY UPDATE 
         ban_type = VALUES(ban_type),
         ban_reason = VALUES(ban_reason),
         expires_at = VALUES(expires_at),
         is_active = TRUE,
         banned_by_admin = TRUE,
         updated_at = CURRENT_TIMESTAMP`,
        [ipAddress, country || 'غير محدد', banType, banReason || 'حظر يدوي من المدير', expiresAt]
      );

      res.json({ success: true, message: 'تم إضافة الحظر بنجاح' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في إضافة الحظر:', error);
    res.status(500).json({ error: 'خطأ في إضافة الحظر' });
  }
});

// إلغاء الحظر
router.post('/unban', async (req, res) => {
  try {
    const { banId } = req.body;
    
    if (!banId) {
      return res.status(400).json({ error: 'معرف الحظر مطلوب' });
    }

    const conn = await pool.getConnection();
    try {
      await conn.execute(
        'UPDATE banned_ips SET is_active = FALSE WHERE id = ?',
        [banId]
      );

      res.json({ success: true, message: 'تم إلغاء الحظر بنجاح' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في إلغاء الحظر:', error);
    res.status(500).json({ error: 'خطأ في إلغاء الحظر' });
  }
});

// الحصول على إعدادات الحظر
router.get('/settings', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [settings] = await conn.execute('SELECT * FROM ban_settings ORDER BY id DESC LIMIT 1');
      res.json(settings[0] || {});
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في جلب الإعدادات:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// تحديث إعدادات الحظر
router.post('/settings', async (req, res) => {
  try {
    const { maxClicksPerWindow, timeWindowSeconds, tempBanDurationMinutes } = req.body;
    
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        'INSERT INTO ban_settings (max_clicks_per_window, time_window_seconds, temp_ban_duration_minutes) VALUES (?, ?, ?)',
        [maxClicksPerWindow, timeWindowSeconds, tempBanDurationMinutes]
      );

      res.json({ success: true, message: 'تم تحديث الإعدادات بنجاح' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في تحديث الإعدادات:', error);
    res.status(500).json({ error: 'خطأ في تحديث الإعدادات' });
  }
});

// إحصائيات الحظر
router.get('/stats', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [stats] = await conn.execute(`
        SELECT 
          COUNT(*) as total_bans,
          COUNT(CASE WHEN is_active = TRUE THEN 1 END) as active_bans,
          COUNT(CASE WHEN ban_type = 'permanent' THEN 1 END) as permanent_bans,
          COUNT(CASE WHEN ban_type = 'temporary' AND is_active = TRUE THEN 1 END) as temp_bans,
          COUNT(CASE WHEN banned_by_admin = TRUE THEN 1 END) as manual_bans,
          COUNT(CASE WHEN banned_by_admin = FALSE THEN 1 END) as auto_bans
        FROM banned_ips
      `);

      res.json(stats[0]);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

export default router;