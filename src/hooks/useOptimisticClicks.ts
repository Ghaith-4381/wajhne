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
  const [optimisticData, setOptimisticData] = useState<OptimisticData>(initialData);
  const [pendingClicks, setPendingClicks] = useState<PendingClick[]>([]);
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // دالة إرسال النقرات للخادم مع الانتظار للحفظ
  const sendPendingClicks = useCallback(async () => {
    if (pendingClicks.length === 0) return;

    const clicksToSend = [...pendingClicks];
    console.log(`📤 إرسال ${clicksToSend.length} نقرة لقاعدة البيانات`);
    
    // مسح الانتظار فوراً
    setPendingClicks([]);

    // إرسال كل نقرة لقاعدة البيانات مع انتظار النتيجة
    for (const click of clicksToSend) {
      try {
        console.log(`💾 حفظ النقرة: الصورة ${click.imageId}, الدولة: ${click.country}`);
        await registerClick(click.imageId, click.country);
        console.log(`✅ تم حفظ النقرة بنجاح في قاعدة البيانات`);
      } catch (error) {
        console.error(`❌ خطأ في حفظ النقرة:`, error);
        // في حالة الخطأ، أعيد النقرة للقائمة للمحاولة مرة أخرى
        setPendingClicks(prev => [...prev, click]);
      }
    }
  }, [pendingClicks]);

  // النقر الفوري مع إرسال فوري لقاعدة البيانات
  const handleOptimisticClick = useCallback(async (imageId: number, country: string) => {
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

    // 2. حفظ النقرة فوراً في قاعدة البيانات (بدون انتظار)
    try {
      registerClick(imageId, country).then(() => {
        console.log(`💾 تم حفظ النقرة في قاعدة البيانات للصورة ${imageId}`);
      }).catch((error) => {
        console.error(`❌ خطأ في حفظ النقرة:`, error);
        // إضافة للقائمة للمحاولة مرة أخرى
        setPendingClicks(prev => [...prev, {
          imageId,
          country,
          timestamp: Date.now()
        }]);
      });
    } catch (error) {
      console.error(`❌ خطأ في حفظ النقرة:`, error);
      // إضافة للقائمة للمحاولة مرة أخرى
      setPendingClicks(prev => [...prev, {
        imageId,
        country,
        timestamp: Date.now()
      }]);
    }
  }, []);

  return {
    optimisticData,
    handleOptimisticClick,
    pendingClicksCount: pendingClicks.length
  };
};
