import { useState, useCallback, useRef } from 'react';
import { registerClick } from '../services/api';

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
  // البيانات المحلية الفورية
  const [optimisticData, setOptimisticData] = useState<OptimisticData>(initialData);
  const [pendingClicks, setPendingClicks] = useState<PendingClick[]>([]);
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // دالة إرسال النقرات للخادم
  const sendPendingClicks = useCallback(async () => {
    if (pendingClicks.length === 0) return;

    const clicksToSend = [...pendingClicks];
    console.log(`📤 إرسال ${clicksToSend.length} نقرة لقاعدة البيانات`);
    
    // مسح الانتظار فوراً
    setPendingClicks([]);

    // إرسال كل نقرة لقاعدة البيانات
    for (const click of clicksToSend) {
      try {
        const newTotal = await registerClick(click.imageId, click.country);
        console.log(`✅ تم حفظ النقرة: الصورة ${click.imageId}, المجموع الجديد: ${newTotal}`);
      } catch (error) {
        console.error(`❌ خطأ في حفظ النقرة:`, error);
        // في حالة الخطأ، أعيد النقرة للقائمة للمحاولة مرة أخرى
        setPendingClicks(prev => [...prev, click]);
      }
    }
  }, [pendingClicks]);

  // النقر الفوري والمتزامن
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
      
      console.log(`✅ السكور الجديد للصورة ${imageId}: ${newData[imageKey].total}`);
      return newData;
    });

    // 2. إضافة للقائمة للإرسال لقاعدة البيانات
    setPendingClicks(prev => [...prev, {
      imageId,
      country,
      timestamp: Date.now()
    }]);

    // 3. جدولة الإرسال لقاعدة البيانات (كل ثانيتين)
    if (sendTimeoutRef.current) {
      clearTimeout(sendTimeoutRef.current);
    }
    sendTimeoutRef.current = setTimeout(sendPendingClicks, 2000);
  }, [sendPendingClicks]);

  return {
    optimisticData,
    handleOptimisticClick,
    pendingClicksCount: pendingClicks.length
  };
};
