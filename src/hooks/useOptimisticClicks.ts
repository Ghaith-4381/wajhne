
import { useState, useCallback, useRef, useEffect } from 'react';

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
  // البيانات المحلية الفورية - تزيد فقط ولا تنقص أبداً
  const [optimisticData, setOptimisticData] = useState<OptimisticData>(initialData);
  const [pendingClicks, setPendingClicks] = useState<PendingClick[]>([]);
  const batchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialized = useRef(false);
  
  // تحديث البيانات الأولية مرة واحدة فقط
  useEffect(() => {
    if (!isInitialized.current && initialData) {
      setOptimisticData(initialData);
      isInitialized.current = true;
    }
  }, [initialData]);

  // إرسال النقرات للخادم في الخلفية فقط (بدون تأثير على الواجهة)
  const processPendingClicks = useCallback(async () => {
    if (pendingClicks.length === 0) return;

    const clicksToProcess = [...pendingClicks];
    setPendingClicks([]);

    // إرسال للخادم في الخلفية بدون انتظار أو تأثير على الواجهة
    try {
      for (const click of clicksToProcess) {
        // إرسال غير متزامن بدون انتظار
        fetch('/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageId: click.imageId, country: click.country })
        }).catch(console.error);
      }
      console.log(`✅ تم إرسال ${clicksToProcess.length} نقرة للخادم`);
    } catch (error) {
      console.error('❌ خطأ في إرسال النقرات:', error);
      // لا نقوم بأي تراجع في الواجهة حتى لو فشل الإرسال
    }
  }, [pendingClicks]);

  // النقر الفوري والنهائي - بدون انتظار أي شيء
  const handleOptimisticClick = useCallback((imageId: number, country: string) => {
    console.log("🚀 نقرة فورية ونهائية على الصورة:", imageId);
    
    // زيادة فورية ونهائية في الواجهة (أول شيء يحدث)
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
      
      console.log("📊 السكور الجديد (فوري ونهائي):", newData[imageKey].total);
      return newData;
    });

    // إضافة للقائمة للإرسال للخادم لاحقاً (بدون تأثير على الواجهة)
    setPendingClicks(prev => [...prev, {
      imageId,
      country,
      timestamp: Date.now()
    }]);

    // جدولة الإرسال للخادم (لا ننتظرها)
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }
    
    batchTimeoutRef.current = setTimeout(() => {
      processPendingClicks();
    }, 2000); // إرسال كل 2 ثانية
  }, [processPendingClicks]);

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
