import { pool } from '../config/database.js';

// التحقق من حالة الحظر
export const checkBanStatus = async (req, res, next) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const conn = await pool.getConnection();

    try {
      // التحقق من الحظر النشط
      const [banResults] = await conn.execute(
        `SELECT * FROM banned_ips 
         WHERE ip_address = ? AND is_active = TRUE 
         AND (ban_type = 'permanent' OR expires_at > NOW())
         LIMIT 1`,
        [clientIp]
      );

      if (banResults.length > 0) {
        const ban = banResults[0];
        return res.status(403).json({
          error: 'محظور',
          message: ban.ban_type === 'permanent' 
            ? 'تم حظرك نهائياً بسبب: ' + ban.ban_reason
            : `تم حظرك مؤقتاً حتى ${new Date(ban.expires_at).toLocaleString('ar')} بسبب: ${ban.ban_reason}`,
          banType: ban.ban_type,
          expiresAt: ban.expires_at,
          reason: ban.ban_reason
        });
      }

      // تنظيف البانات المنتهية
      await conn.execute(
        'UPDATE banned_ips SET is_active = FALSE WHERE expires_at <= NOW() AND ban_type = "temporary"'
      );

      req.clientIp = clientIp;
      next();
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في فحص الحظر:', error);
    next();
  }
};

// مراقبة معدل النقرات والحظر التلقائي
export const monitorClickRate = async (req, res, next) => {
  try {
    const { imageId, country } = req.body;
    const clientIp = req.clientIp;
    const conn = await pool.getConnection();

    try {
      // الحصول على إعدادات الحظر
      const [settings] = await conn.execute('SELECT * FROM ban_settings ORDER BY id DESC LIMIT 1');
      const { max_clicks_per_window, time_window_seconds, temp_ban_duration_minutes } = settings[0];

      // تسجيل النقرة الحالية
      await conn.execute(
        'INSERT INTO click_tracking (ip_address, image_id, country) VALUES (?, ?, ?)',
        [clientIp, imageId, country]
      );

      // حساب عدد النقرات في النافزة الزمنية
      const [clickCounts] = await conn.execute(
        `SELECT COUNT(*) as click_count FROM click_tracking 
         WHERE ip_address = ? AND clicked_at >= DATE_SUB(NOW(), INTERVAL ? SECOND)`,
        [clientIp, time_window_seconds]
      );

      const currentClickCount = clickCounts[0].click_count;

      // إذا تجاوز الحد المسموح
      if (currentClickCount > max_clicks_per_window) {
        const expiresAt = new Date(Date.now() + temp_ban_duration_minutes * 60 * 1000);
        
        // إضافة حظر مؤقت
        await conn.execute(
          `INSERT INTO banned_ips (ip_address, country, ban_type, ban_reason, expires_at, click_count_at_ban)
           VALUES (?, ?, 'temporary', 'تجاوز الحد المسموح للنقرات', ?, ?)
           ON DUPLICATE KEY UPDATE 
           expires_at = VALUES(expires_at), 
           is_active = TRUE, 
           click_count_at_ban = VALUES(click_count_at_ban),
           updated_at = CURRENT_TIMESTAMP`,
          [clientIp, country, expiresAt, currentClickCount]
        );

        return res.status(429).json({
          error: 'تم حظرك مؤقتاً',
          message: `تم حظرك لمدة ${temp_ban_duration_minutes} دقيقة بسبب النقر المفرط (${currentClickCount} نقرات خلال ${time_window_seconds} ثواني)`,
          banType: 'temporary',
          expiresAt: expiresAt,
          clickCount: currentClickCount
        });
      }

      // تنظيف السجلات القديمة (أكثر من ساعة)
      await conn.execute(
        'DELETE FROM click_tracking WHERE clicked_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)'
      );

      next();
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في مراقبة النقرات:', error);
    next();
  }
};