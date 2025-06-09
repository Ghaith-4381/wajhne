
import { pool } from '../config/database.js';

// التحقق من النقرات التلقائية
export const antiClickBotMiddleware = async (req, res, next) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'];
    const userAgent = req.headers['user-agent'] || '';
    const { imageId, isTrusted, clickTimestamp } = req.body;

    const conn = await pool.getConnection();

    try {
      // الحصول على إعدادات الحماية
      const [settings] = await conn.execute(
        'SELECT * FROM anti_click_bot_settings WHERE id = 1 LIMIT 1'
      );

      if (settings.length === 0 || !settings[0].is_enabled) {
        req.antiClickBotPassed = true;
        return next();
      }

      const config = settings[0];

      // 1. فحص isTrusted - رفض النقرات غير الموثقة
      if (isTrusted === false) {
        await logSuspiciousClick(conn, clientIp, userAgent, imageId, 'untrusted', {
          message: 'Click event is not trusted',
          timestamp: clickTimestamp
        });

        return res.status(429).json({
          error: 'نقرة غير صالحة',
          message: 'تم رفض النقرة لأنها ليست من مستخدم حقيقي',
          type: 'untrusted_click'
        });
      }

      // 2. الحصول على أو إنشاء سجل المستخدم
      let [userRecord] = await conn.execute(
        'SELECT * FROM user_click_tracking WHERE ip_address = ? LIMIT 1',
        [clientIp]
      );

      if (userRecord.length === 0) {
        await conn.execute(
          'INSERT INTO user_click_tracking (ip_address, user_agent, click_count, first_click_at) VALUES (?, ?, 1, NOW())',
          [clientIp, userAgent]
        );
        req.antiClickBotPassed = true;
        return next();
      }

      const user = userRecord[0];

      // 3. فحص إذا كان المستخدم محظوراً
      if (user.is_blocked && user.block_expires_at && new Date() < new Date(user.block_expires_at)) {
        return res.status(429).json({
          error: 'محظور مؤقتاً',
          message: `تم حظرك مؤقتاً حتى ${new Date(user.block_expires_at).toLocaleString('ar')}`,
          type: 'temporarily_blocked',
          expiresAt: user.block_expires_at
        });
      }

      // 4. فحص معدل النقرات
      const timeWindowStart = new Date(Date.now() - (config.time_window_seconds * 1000));
      
      // حساب النقرات في النافذة الزمنية
      if (user.last_click_at && new Date(user.last_click_at) > timeWindowStart) {
        const clickCount = user.click_count;
        
        if (clickCount >= config.max_clicks_per_minute) {
          // تسجيل النشاط المشبوه
          await logSuspiciousClick(conn, clientIp, userAgent, imageId, 'rate_limit_exceeded', {
            clickCount: clickCount,
            maxAllowed: config.max_clicks_per_minute,
            timeWindow: config.time_window_seconds
          });

          // حظر المستخدم
          const blockExpiresAt = new Date(Date.now() + (config.block_duration_minutes * 60 * 1000));
          await conn.execute(
            `UPDATE user_click_tracking 
             SET is_blocked = TRUE, block_expires_at = ?, suspicious_activity_count = suspicious_activity_count + 1
             WHERE ip_address = ?`,
            [blockExpiresAt, clientIp]
          );

          return res.status(429).json({
            error: 'تجاوز الحد المسموح',
            message: `تم حظرك لمدة ${config.block_duration_minutes} دقائق بسبب النقر المفرط`,
            type: 'rate_limit_exceeded',
            clickCount: clickCount,
            maxAllowed: config.max_clicks_per_minute,
            blockDuration: config.block_duration_minutes,
            requiresCaptcha: config.require_captcha
          });
        }
      }

      // 5. تحديث عداد النقرات
      if (!user.last_click_at || new Date(user.last_click_at) <= timeWindowStart) {
        // إعادة تعيين العداد للنافذة الزمنية الجديدة
        await conn.execute(
          'UPDATE user_click_tracking SET click_count = 1, last_click_at = NOW() WHERE ip_address = ?',
          [clientIp]
        );
      } else {
        // زيادة العداد
        await conn.execute(
          'UPDATE user_click_tracking SET click_count = click_count + 1, last_click_at = NOW() WHERE ip_address = ?',
          [clientIp]
        );
      }

      req.antiClickBotPassed = true;
      next();

    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في middleware مكافحة النقرات التلقائية:', error);
    // في حالة الخطأ، اسمح بالمرور لتجنب كسر الموقع
    req.antiClickBotPassed = true;
    next();
  }
};

// تسجيل النقرة المشبوهة
async function logSuspiciousClick(conn, ipAddress, userAgent, imageId, clickType, details) {
  try {
    await conn.execute(
      'INSERT INTO suspicious_clicks_log (ip_address, user_agent, image_id, click_type, details) VALUES (?, ?, ?, ?, ?)',
      [ipAddress, userAgent, imageId, clickType, JSON.stringify(details)]
    );
  } catch (error) {
    console.error('خطأ في تسجيل النقرة المشبوهة:', error);
  }
}

// تنظيف السجلات القديمة (يتم استدعاؤها دورياً)
export const cleanupOldRecords = async () => {
  try {
    const conn = await pool.getConnection();
    
    try {
      // حذف سجلات التتبع القديمة (أكثر من 24 ساعة)
      await conn.execute(
        'DELETE FROM user_click_tracking WHERE last_click_at < DATE_SUB(NOW(), INTERVAL 24 HOUR) AND is_blocked = FALSE'
      );

      // حذف سجلات النقرات المشبوهة القديمة (أكثر من 7 أيام)
      await conn.execute(
        'DELETE FROM suspicious_clicks_log WHERE blocked_at < DATE_SUB(NOW(), INTERVAL 7 DAY)'
      );

      // إلغاء حظر المستخدمين المنتهية صلاحية حظرهم
      await conn.execute(
        'UPDATE user_click_tracking SET is_blocked = FALSE, block_expires_at = NULL WHERE is_blocked = TRUE AND block_expires_at < NOW()'
      );

    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('خطأ في تنظيف السجلات:', error);
  }
};
