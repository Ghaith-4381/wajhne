import { useState, useCallback, useRef } from 'react';

interface OptimisticData {
  image1: { total: number; countries: Record<string, number> };
  image2: { total: number; countries: Record<string, number> };
}

interface PendingClick {
  imageId: number;
  country: string;
  timestamp: number;
}

export const useOptimisticClicks = (initialData: OptimisticData) => {
  // البيانات المحلية الفورية - لا تتراجع أبداً
  const [optimisticData, setOptimisticData] = useState<OptimisticData>(initialData);
  const [pendingClicks, setPendingClicks] = useState<PendingClick[]>([]);
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // دالة إرسال النقرات للخادم (في الخلفية)
  const sendPendingClicks = useCallback(async () => {
    if (pendingClicks.length === 0) return;

    const clicksToSend = [...pendingClicks];
    setPendingClicks([]); // مسح الانتظار فوراً

    // إرسال غير متزامن - لا ننتظر النتيجة
    clicksToSend.forEach(async (click) => {
      try {
        await fetch('/api/click', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            imageId: click.imageId, 
            country: click.country 
          })
        });
      } catch (error) {
        console.error('خطأ في إرسال النقرة:', error);
        // لا نقوم بأي تراجع - الواجهة تبقى كما هي
      }
    });
  }, [pendingClicks]);

  // النقر الفوري والنهائي
  const handleOptimisticClick = useCallback((imageId: number, country: string) => {
    console.log(`🚀 نقرة فورية على الصورة ${imageId}`);
    
    // 1. تحديث الواجهة فوراً (أهم شيء!)
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
      
      console.log(`✅ السكور الجديد: ${newData[imageKey].total}`);
      return newData;
    });

    // 2. إضافة للقائمة للإرسال
    setPendingClicks(prev => [...prev, {
      imageId,
      country,
      timestamp: Date.now()
    }]);

    // 3. جدولة الإرسال (كل ثانية واحدة)
    if (sendTimeoutRef.current) {
      clearTimeout(sendTimeoutRef.current);
    }
    sendTimeoutRef.current = setTimeout(sendPendingClicks, 1000);
  }, [sendPendingClicks]);

  return {
    optimisticData,
    handleOptimisticClick,
    pendingClicksCount: pendingClicks.length
  };
};
