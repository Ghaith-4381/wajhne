import { useQuery } from "@tanstack/react-query";
import { fetchStats, CountryStatsData } from "../services/api";
import { useOptimisticClicks } from "./useOptimisticClicks";
import { useRealTimeSync } from "./useRealTimeSync";
import { useState, useCallback } from "react";

const createSafeInitialData = () => ({
  image1: { total: 0, countries: {} },
  image2: { total: 0, countries: {} }
});

const fallbackData = {
  image1: {
    total: 1234,
    countries: {
      "Syria": 500,
      "Egypt": 300,
      "Saudi Arabia": 200,
      "Germany": 150,
      "Turkey": 84
    }
  },
  image2: {
    total: 987,
    countries: {
      "Syria": 400,
      "Egypt": 250,
      "Saudi Arabia": 175,
      "Germany": 100,
      "Turkey": 62
    }
  }
};

const ensureDataSafety = (data: any): CountryStatsData => {
  if (!data || typeof data !== 'object') {
    return createSafeInitialData();
  }

  return {
    image1: {
      total: data.image1?.total || 0,
      countries: data.image1?.countries || {}
    },
    image2: {
      total: data.image2?.total || 0,
      countries: data.image2?.countries || {}
    }
  };
};

export const useClickStats = () => {
  const [useLocalData, setUseLocalData] = useState(false);

  // جلب البيانات الأولية من السيرفر
  const { data: rawClickData, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    retry: 1,
    staleTime: 60000, // تقليل الوقت للحصول على بيانات أحدث
    enabled: !useLocalData,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false
  });

  const safeClickData = ensureDataSafety(rawClickData);
  
  // استخدام البيانات المحلية الفورية
  const {
    optimisticData,
    handleOptimisticClick,
    pendingClicksCount
  } = useOptimisticClicks(useLocalData ? fallbackData : safeClickData);

  // مزامنة مع السيرفر كل ثانيتين
  const {
    syncedData,
    lastSyncTime,
    isOnline,
    forceSync
  } = useRealTimeSync(optimisticData, {
    interval: 2000, // مزامنة كل ثانيتين
    enabled: !useLocalData
  });

  // البيانات المعروضة = البيانات المتزامنة (مزيج من المحلية والعالمية)
  const clickData = syncedData;

  if (error && !useLocalData) {
    console.log("تفعيل البيانات الاحتياطية بسبب خطأ في API:", error);
    setUseLocalData(true);
  }

  const totalClicks = (clickData.image1?.total || 0) + (clickData.image2?.total || 0);
  const image1Percentage = totalClicks > 0 ? ((clickData.image1?.total || 0) / totalClicks) * 100 : 50;
  const image2Percentage = totalClicks > 0 ? ((clickData.image2?.total || 0) / totalClicks) * 100 : 50;
  
  const getTopCountry = useCallback(() => {
    const countryCounts = new Map<string, number>();
    
    const image1Countries = clickData.image1?.countries || {};
    const image2Countries = clickData.image2?.countries || {};
    
    Object.entries(image1Countries).forEach(([country, count]) => {
      countryCounts.set(country, (countryCounts.get(country) || 0) + (count as number));
    });
    
    Object.entries(image2Countries).forEach(([country, count]) => {
      countryCounts.set(country, (countryCounts.get(country) || 0) + (count as number));
    });
    
    let maxClicks = 0;
    let topCountry = "";
    
    countryCounts.forEach((count, country) => {
      if (count > maxClicks) {
        maxClicks = count;
        topCountry = country;
      }
    });
    
    return { country: topCountry, clicks: maxClicks };
  }, [clickData]);

  const topCountry = getTopCountry();

  // دالة النقر الهجينة: فورية + مزامنة عالمية
  const handleImageClick = useCallback((imageNum: number, country: string) => {
    console.log(`🎯 نقرة هجينة فورية على الصورة ${imageNum} من ${country}`);
    console.log(`⏱️ الوقت: ${new Date().toLocaleTimeString()}`);
    
    // النقر الفوري (optimistic)
    handleOptimisticClick(imageNum, country);
    
    // مزامنة فورية إضافية بعد النقر (اختيارية)
    setTimeout(() => {
      forceSync();
    }, 100);
  }, [handleOptimisticClick, forceSync]);

  return {
    clickData,
    isLoading,
    useLocalData,
    handleImageClick,
    image1Percentage,
    image2Percentage,
    totalClicks,
    topCountry,
    isUpdating: false,
    pendingClicksCount,
    // معلومات المزامنة
    lastSyncTime,
    isOnline,
    forceSync
  };
};
