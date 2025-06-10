import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from "@/integrations/supabase/client";

interface UserScore {
  image1: number;
  image2: number;
}

interface PendingClicks {
  image1: number;
  image2: number;
}

const STORAGE_KEY = 'userScore';
const PENDING_KEY = 'pendingClicks';
const BATCH_SIZE = 5; // إرسال كل 5 نقرات
const BATCH_TIMEOUT = 10000; // أو كل 10 ثواني

export const useUserScore = () => {
  const [userScore, setUserScore] = useState<UserScore>({ image1: 0, image2: 0 });
  const [pendingClicks, setPendingClicks] = useState<PendingClicks>({ image1: 0, image2: 0 });
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // تحميل السكور المحفوظ محلياً
  useEffect(() => {
    const savedScore = localStorage.getItem(STORAGE_KEY);
    const savedPending = localStorage.getItem(PENDING_KEY);
    
    if (savedScore) {
      try {
        setUserScore(JSON.parse(savedScore));
      } catch (error) {
        console.error('Error parsing saved score:', error);
      }
    }

    if (savedPending) {
      try {
        const pending = JSON.parse(savedPending);
        setPendingClicks(pending);
        // إرسال النقرات المعلقة عند تحميل الصفحة
        if (pending.image1 > 0 || pending.image2 > 0) {
          sendPendingClicks(pending);
        }
      } catch (error) {
        console.error('Error parsing pending clicks:', error);
      }
    }
  }, []);

  // حفظ السكور محلياً
  const saveToLocalStorage = useCallback((score: UserScore, pending: PendingClicks) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(score));
    localStorage.setItem(PENDING_KEY, JSON.stringify(pending));
  }, []);

  // إرسال النقرات المعلقة لقاعدة البيانات
  const sendPendingClicks = useCallback(async (clicks: PendingClicks) => {
    try {
      console.log('Sending pending clicks to database:', clicks);
      
      // إرسال النقرات لكل صورة
      if (clicks.image1 > 0) {
        for (let i = 0; i < clicks.image1; i++) {
          await supabase
            .from('click_events')
            .insert({
              image_id: 1,
              country: 'User'
            });
        }
      }

      if (clicks.image2 > 0) {
        for (let i = 0; i < clicks.image2; i++) {
          await supabase
            .from('click_events')
            .insert({
              image_id: 2,
              country: 'User'
            });
        }
      }
      
      // مسح النقرات المعلقة بعد الإرسال الناجح
      setPendingClicks({ image1: 0, image2: 0 });
      localStorage.setItem(PENDING_KEY, JSON.stringify({ image1: 0, image2: 0 }));
      
      console.log('Successfully sent pending clicks');
    } catch (error) {
      console.error('Failed to send pending clicks:', error);
    }
  }, []);

  // زيادة سكور المستخدم
  const incrementUserScore = useCallback((imageId: 1 | 2) => {
    const imageKey = imageId === 1 ? 'image1' : 'image2';
    
    setUserScore(prev => {
      const newScore = { ...prev, [imageKey]: prev[imageKey] + 1 };
      
      setPendingClicks(prevPending => {
        const newPending = { ...prevPending, [imageKey]: prevPending[imageKey] + 1 };
        
        // حفظ محلياً
        saveToLocalStorage(newScore, newPending);
        
        // التحقق من ضرورة الإرسال
        const totalPending = newPending.image1 + newPending.image2;
        
        if (totalPending >= BATCH_SIZE) {
          // إرسال فوري عند الوصول لحد النقرات
          sendPendingClicks(newPending);
        } else {
          // إعداد مؤقت للإرسال
          if (batchTimeoutRef.current) {
            clearTimeout(batchTimeoutRef.current);
          }
          
          batchTimeoutRef.current = setTimeout(() => {
            if (newPending.image1 > 0 || newPending.image2 > 0) {
              sendPendingClicks(newPending);
            }
          }, BATCH_TIMEOUT);
        }
        
        return newPending;
      });
      
      return newScore;
    });
  }, [saveToLocalStorage, sendPendingClicks]);

  // مسح سكور المستخدم (للاختبار)
  const resetUserScore = useCallback(() => {
    setUserScore({ image1: 0, image2: 0 });
    setPendingClicks({ image1: 0, image2: 0 });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(PENDING_KEY);
  }, []);

  // تنظيف المؤقت عند إلغاء التحميل
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  return {
    userScore,
    pendingClicks,
    incrementUserScore,
    resetUserScore,
    hasPendingClicks: pendingClicks.image1 > 0 || pendingClicks.image2 > 0
  };
};
