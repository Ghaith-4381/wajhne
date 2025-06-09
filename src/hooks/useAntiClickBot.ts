import { useState, useCallback } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../config/constants';

interface AntiClickBotSettings {
  id: number;
  is_enabled: boolean;
  max_clicks_per_minute: number;
  time_window_seconds: number;
  block_duration_minutes: number;
  require_captcha: boolean;
}

interface AntiClickBotStats {
  totalUsers: number;
  blockedUsers: number;
  suspiciousClicks24h: number;
  topSuspiciousUsers: any[];
  clickTypeStats: any[];
}

export const useAntiClickBot = () => {
  const [settings, setSettings] = useState<AntiClickBotSettings | null>(null);
  const [stats, setStats] = useState<AntiClickBotStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // جلب الإعدادات
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/admin-4Bxr7Xt89/anti-click-bot/settings`);
      setSettings(response.data.settings);
    } catch (err) {
      setError('فشل في جلب الإعدادات');
      console.error('Error fetching anti-click-bot settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // تحديث الإعدادات
  const updateSettings = useCallback(async (newSettings: Partial<AntiClickBotSettings>) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.put(`${API_BASE_URL}/api/admin-4Bxr7Xt89/anti-click-bot/settings`, newSettings);
      if (response.data.success) {
        await fetchSettings(); // إعادة جلب الإعدادات المحدثة
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      setError('فشل في تحديث الإعدادات');
      console.error('Error updating anti-click-bot settings:', err);
      return { success: false, error: 'فشل في تحديث الإعدادات' };
    } finally {
      setLoading(false);
    }
  }, [fetchSettings]);

  // جلب الإحصائيات
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_BASE_URL}/api/admin-4Bxr7Xt89/anti-click-bot/stats`);
      setStats(response.data.stats);
    } catch (err) {
      setError('فشل في جلب الإحصائيات');
      console.error('Error fetching anti-click-bot stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // إلغاء حظر مستخدم
  const unblockUser = useCallback(async (ipAddress: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/api/admin-4Bxr7Xt89/anti-click-bot/unblock-user`, {
        ip_address: ipAddress
      });
      if (response.data.success) {
        await fetchStats(); // تحديث الإحصائيات
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      setError('فشل في إلغاء حظر المستخدم');
      console.error('Error unblocking user:', err);
      return { success: false, error: 'فشل في إلغاء حظر المستخدم' };
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  // إعادة تعيين النقرات
  const resetUserClicks = useCallback(async (ipAddress: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/api/admin-4Bxr7Xt89/anti-click-bot/reset-user-clicks`, {
        ip_address: ipAddress
      });
      if (response.data.success) {
        await fetchStats(); // تحديث الإحصائيات
        return { success: true, message: response.data.message };
      }
    } catch (err) {
      setError('فشل في إعادة تعيين النقرات');
      console.error('Error resetting user clicks:', err);
      return { success: false, error: 'فشل في إعادة تعيين النقرات' };
    } finally {
      setLoading(false);
    }
  }, [fetchStats]);

  // التحقق من صحة النقرة
  const validateClick = useCallback((event: React.MouseEvent | React.TouchEvent): boolean => {
    // فحص isTrusted
    if (!event.isTrusted) {
      console.warn('Click rejected: Not trusted');
      return false;
    }

    // فحص إضافي للنقرات السريعة جداً
    const now = Date.now();
    const lastClickTime = localStorage.getItem('lastClickTime');
    
    if (lastClickTime) {
      const timeDiff = now - parseInt(lastClickTime);
      if (timeDiff < 50) { // أقل من 50ms بين النقرات
        console.warn('Click rejected: Too fast');
        return false;
      }
    }

    localStorage.setItem('lastClickTime', now.toString());
    return true;
  }, []);

  return {
    settings,
    stats,
    loading,
    error,
    fetchSettings,
    updateSettings,
    fetchStats,
    unblockUser,
    resetUserClicks,
    validateClick
  };
};
