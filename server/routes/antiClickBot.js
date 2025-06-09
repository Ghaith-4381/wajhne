import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// Initialize default settings if they don't exist
const initializeSettings = async () => {
  try {
    const conn = await pool.getConnection();
    try {
      // Check if settings exist
      const [settings] = await conn.execute('SELECT * FROM anti_click_bot_settings WHERE id = 1');
      
      if (settings.length === 0) {
        // Create default settings
        await conn.execute(
          `INSERT INTO anti_click_bot_settings 
           (id, is_enabled, max_clicks_per_minute, time_window_seconds, block_duration_minutes, require_captcha, created_at, updated_at) 
           VALUES (1, true, 100, 60, 5, true, NOW(), NOW())`
        );
        console.log('✅ Default anti-click-bot settings created');
      } else {
        console.log('✅ Anti-click-bot settings already exist');
      }
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('❌ Error initializing anti-click-bot settings:', error);
  }
};

// Initialize settings on module load
initializeSettings();

// الحصول على إعدادات مكافحة النقرات التلقائية
router.get('/settings', async (req, res) => {
  try {
    console.log('Getting anti-click-bot settings...');
    const conn = await pool.getConnection();
    
    try {
      const [settings] = await conn.execute('SELECT * FROM anti_click_bot_settings WHERE id = 1 LIMIT 1');
      
      if (settings.length === 0) {
        console.log('No settings found, creating default...');
        // Create default settings if they don't exist
        await conn.execute(
          `INSERT INTO anti_click_bot_settings 
           (id, is_enabled, max_clicks_per_minute, time_window_seconds, block_duration_minutes, require_captcha, created_at, updated_at) 
           VALUES (1, true, 100, 60, 5, true, NOW(), NOW())`
        );
        
        // Fetch the newly created settings
        const [newSettings] = await conn.execute('SELECT * FROM anti_click_bot_settings WHERE id = 1 LIMIT 1');
        return res.json({ success: true, settings: newSettings[0] });
      }

      console.log('Settings found:', settings[0]);
      res.json({ success: true, settings: settings[0] });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في جلب الإعدادات:', error);
    res.status(500).json({ error: 'خطأ في الخادم', details: error.message });
  }
});

// تحديث إعدادات مكافحة النقرات التلقائية
router.put('/settings', async (req, res) => {
  try {
    const {
      is_enabled,
      max_clicks_per_minute,
      time_window_seconds,
      block_duration_minutes,
      require_captcha
    } = req.body;

    // التحقق من صحة البيانات
    if (typeof is_enabled !== 'boolean' ||
        !Number.isInteger(max_clicks_per_minute) || max_clicks_per_minute < 1 ||
        !Number.isInteger(time_window_seconds) || time_window_seconds < 1 ||
        !Number.isInteger(block_duration_minutes) || block_duration_minutes < 1 ||
        typeof require_captcha !== 'boolean') {
      return res.status(400).json({ error: 'بيانات غير صالحة' });
    }

    const conn = await pool.getConnection();
    
    try {
      await conn.execute(
        `UPDATE anti_click_bot_settings 
         SET is_enabled = ?, max_clicks_per_minute = ?, time_window_seconds = ?, 
             block_duration_minutes = ?, require_captcha = ?, updated_at = NOW()
         WHERE id = 1`,
        [is_enabled, max_clicks_per_minute, time_window_seconds, block_duration_minutes, require_captcha]
      );

      res.json({ success: true, message: 'تم تحديث الإعدادات بنجاح' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في تحديث الإعدادات:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// الحصول على إحصائيات مكافحة النقرات التلقائية
router.get('/stats', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    try {
      // إحصائيات عامة
      const [totalUsers] = await conn.execute(
        'SELECT COUNT(*) as total_users FROM user_click_tracking'
      );

      const [blockedUsers] = await conn.execute(
        'SELECT COUNT(*) as blocked_users FROM user_click_tracking WHERE is_blocked = TRUE'
      );

      const [suspiciousClicks] = await conn.execute(
        'SELECT COUNT(*) as suspicious_clicks FROM suspicious_clicks_log WHERE blocked_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)'
      );

      // أكثر المستخدمين نشاطاً مشبوهاً
      const [topSuspiciousUsers] = await conn.execute(
        `SELECT ip_address, suspicious_activity_count, click_count, is_blocked, block_expires_at, last_click_at
         FROM user_click_tracking 
         WHERE suspicious_activity_count > 0 
         ORDER BY suspicious_activity_count DESC 
         LIMIT 10`
      );

      // إحصائيات أنواع النقرات المشبوهة
      const [clickTypeStats] = await conn.execute(
        `SELECT click_type, COUNT(*) as count 
         FROM suspicious_clicks_log 
         WHERE blocked_at > DATE_SUB(NOW(), INTERVAL 24 HOUR)
         GROUP BY click_type`
      );

      res.json({
        success: true,
        stats: {
          totalUsers: totalUsers[0].total_users,
          blockedUsers: blockedUsers[0].blocked_users,
          suspiciousClicks24h: suspiciousClicks[0].suspicious_clicks,
          topSuspiciousUsers,
          clickTypeStats
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في جلب الإحصائيات:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// إلغاء حظر مستخدم
router.post('/unblock-user', async (req, res) => {
  try {
    const { ip_address } = req.body;

    if (!ip_address) {
      return res.status(400).json({ error: 'عنوان IP مطلوب' });
    }

    const conn = await pool.getConnection();
    
    try {
      const [result] = await conn.execute(
        'UPDATE user_click_tracking SET is_blocked = FALSE, block_expires_at = NULL WHERE ip_address = ?',
        [ip_address]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'لم يتم العثور على المستخدم' });
      }

      res.json({ success: true, message: 'تم إلغاء حظر المستخدم بنجاح' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في إلغاء حظر المستخدم:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// إعادة تعيين النقرات لمستخدم
router.post('/reset-user-clicks', async (req, res) => {
  try {
    const { ip_address } = req.body;

    if (!ip_address) {
      return res.status(400).json({ error: 'عنوان IP مطلوب' });
    }

    const conn = await pool.getConnection();
    
    try {
      const [result] = await conn.execute(
        'UPDATE user_click_tracking SET click_count = 0, suspicious_activity_count = 0, is_blocked = FALSE, block_expires_at = NULL WHERE ip_address = ?',
        [ip_address]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'لم يتم العثور على المستخدم' });
      }

      res.json({ success: true, message: 'تم إعادة تعيين النقرات بنجاح' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في إعادة تعيين النقرات:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

// الحصول على قائمة المستخدمين مع تفاصيل النقرات
router.get('/users', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const offset = (page - 1) * limit;

    const conn = await pool.getConnection();
    
    try {
      const [users] = await conn.execute(
        `SELECT ip_address, user_agent, click_count, suspicious_activity_count, 
                is_blocked, block_expires_at, first_click_at, last_click_at
         FROM user_click_tracking 
         ORDER BY last_click_at DESC 
         LIMIT ? OFFSET ?`,
        [limit, offset]
      );

      const [totalCount] = await conn.execute(
        'SELECT COUNT(*) as total FROM user_click_tracking'
      );

      res.json({
        success: true,
        users,
        pagination: {
          page,
          limit,
          total: totalCount[0].total,
          totalPages: Math.ceil(totalCount[0].total / limit)
        }
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في جلب المستخدمين:', error);
    res.status(500).json({ error: 'خطأ في الخادم' });
  }
});

export default router;
