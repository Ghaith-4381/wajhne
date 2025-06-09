import { useState, useCallback, useRef, useEffect } from 'react';
import { registerClick } from '../services/api';

interface PendingClick {
  imageId: number;
  country: string;
  timestamp: number;
}

interface OptimisticData {
  image1: { total: number; countries: Record<string, number> };
  image2: { total: number; countries: Record<string, number> };
}

export const useOptimisticClicks = (initialData: OptimisticData) => {
  // البيانات المحلية - تزيد فقط ولا تنقص أبداً
  const [optimisticData, setOptimisticData] = useState<OptimisticData>(initialData);
  const [pendingClicks, setPendingClicks] = useState<PendingClick[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  
  // تحديث البيانات الأولية مرة واحدة فقط عند البداية
  useEffect(() => {
    if (!isInitialized.current && initialData) {
      setOptimisticData(initialData);
      isInitialized.current = true;
    }
  }, [initialData]);

  // إرسال النقرات للخادم بدون تأثير على الواجهة
  const processPendingClicks = useCallback(async () => {
    if (pendingClicks.length === 0) return;

    const clicksToProcess = [...pendingClicks];
    setPendingClicks([]);

    // تجميع النقرات حسب الصورة والدولة
    const clickBatches = new Map<string, { imageId: number; country: string; count: number }>();
    
    clicksToProcess.forEach(click => {
      const key = `${click.imageId}-${click.country}`;
      const existing = clickBatches.get(key);
      if (existing) {
        existing.count++;
      } else {
        clickBatches.set(key, { 
          imageId: click.imageId, 
          country: click.country, 
          count: 1 
        });
      }
    });

    // إرسال النقرات للخادم بدون انتظار أو تأثير على الواجهة
    try {
      const promises = Array.from(clickBatches.values()).map(batch =>
        Promise.all(
          Array(batch.count).fill(null).map(() => 
            registerClick(batch.imageId, batch.country)
          )
        )
      );
      
      await Promise.all(promises);
      console.log(`✅ تم إرسال ${clicksToProcess.length} نقرة للخادم`);
    } catch (error) {
      console.error('❌ خطأ في إرسال النقرات:', error);
      // لا نقوم بأي تراجع في الواجهة حتى لو فشل الإرسال
    }
  }, [pendingClicks]);

  // النقر الفوري والنهائي - لا تراجع أبداً
  const handleOptimisticClick = useCallback((imageId: number, country: string) => {
    console.log("🚀 نقرة فورية ونهائية على الصورة:", imageId);
    
    // زيادة فورية ونهائية في الواجهة
    setOptimisticData(prev => {
      const imageKey = imageId === 1 ? 'image1' : 'image2';
      const newData = {
        ...prev,
        [imageKey]: {
          ...prev[imageKey],
          total: prev[imageKey].total + 1,
          countries: {
            ...prev[imageKey].countries,
            [country]: (prev[imageKey].countries[country] || 0) + 1
          }
        }
      };
      
      console.log("📊 النقاط الجديدة (نهائية):", newData);
      return newData;
    });

    // إضافة للقائمة المؤجلة للإرسال (بدون تأثير على الواجهة)
    setPendingClicks(prev => [...prev, {
      imageId,
      country,
      timestamp: Date.now()
    }]);

    // جدولة الإرسال للخادم
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }
    
    batchTimeoutRef.current = setTimeout(() => {
      processPendingClicks();
    }, 1000);
  }, [processPendingClicks]);

  // تنظيف المؤقت
  useEffect(() => {
    return () => {
      if (batchTimeoutRef.current) {
        clearTimeout(batchTimeoutRef.current);
      }
    };
  }, []);

  return {
    optimisticData,
    handleOptimisticClick,
    pendingClicksCount: pendingClicks.length
  };
};
