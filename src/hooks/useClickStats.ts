import { useQuery } from "@tanstack/react-query";
import { fetchStats, CountryStatsData } from "../services/api";
import { useOptimisticClicks } from "./useOptimisticClicks";
import { useState, useCallback, useEffect } from "react";

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

  // جلب البيانات الأولية فقط
  const { data: rawClickData, isLoading } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    retry: 1,
    staleTime: Infinity, // لا نريد إعادة جلب تلقائية
    refetchInterval: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !useLocalData
  });

  const safeClickData = ensureDataSafety(rawClickData);
  
  // النظام المحسن للنقرات الفورية
  const {
    optimisticData,
    handleOptimisticClick,
    pendingClicksCount
  } = useOptimisticClicks(useLocalData ? fallbackData : safeClickData);

  // التبديل للبيانات المحلية في حالة الخطأ
  useEffect(() => {
    if (!rawClickData && !isLoading && !useLocalData) {
      console.log("تفعيل البيانات الاحتياطية");
      setUseLocalData(true);
    }
  }, [rawClickData, isLoading, useLocalData]);

  // حساب النسب
  const totalClicks = (optimisticData.image1?.total || 0) + (optimisticData.image2?.total || 0);
  const image1Percentage = totalClicks > 0 ? ((optimisticData.image1?.total || 0) / totalClicks) * 100 : 50;
  const image2Percentage = totalClicks > 0 ? ((optimisticData.image2?.total || 0) / totalClicks) * 100 : 50;
  
  // البحث عن الدولة المتصدرة
  const getTopCountry = useCallback(() => {
    const countryCounts = new Map<string, number>();
    
    const image1Countries = optimisticData.image1?.countries || {};
    const image2Countries = optimisticData.image2?.countries || {};
    
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
  }, [optimisticData]);

  const topCountry = getTopCountry();

  // دالة النقر السريعة والفورية
  const handleImageClick = useCallback((imageNum: number, country: string) => {
    console.log(`⚡ نقرة سريعة على الصورة ${imageNum}`);
    handleOptimisticClick(imageNum, country);
  }, [handleOptimisticClick]);

  return {
    clickData: optimisticData,
    isLoading,
    useLocalData,
    handleImageClick,
    image1Percentage,
    image2Percentage,
    totalClicks,
    topCountry,
    isUpdating: false,
    pendingClicksCount
  };
};
