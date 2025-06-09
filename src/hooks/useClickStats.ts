
import { useQuery, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();

  // جلب البيانات الحقيقية من قاعدة البيانات
  const { data: rawClickData, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    retry: 2,
    staleTime: 30000, // 30 ثانية
    refetchInterval: 10000, // تحديث كل 10 ثواني لمزامنة البيانات
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    enabled: !useLocalData
  });

  const safeClickData = ensureDataSafety(rawClickData);
  
  console.log('📊 البيانات من قاعدة البيانات:', safeClickData);
  
  // النظام المحسن للنقرات الفورية
  const {
    optimisticData,
    handleOptimisticClick,
    pendingClicksCount
  } = useOptimisticClicks(useLocalData ? fallbackData : safeClickData);

  // التبديل للبيانات المحلية في حالة الخطأ
  useEffect(() => {
    if (error && !isLoading && !useLocalData) {
      console.log("❌ خطأ في قاعدة البيانات، تفعيل البيانات الاحتياطية");
      setUseLocalData(true);
    }
  }, [error, isLoading, useLocalData]);

  // تحديث البيانات المحلية عند وصول بيانات جديدة من قاعدة البيانات
  useEffect(() => {
    if (rawClickData && !useLocalData) {
      console.log('🔄 تحديث البيانات المحلية مع بيانات قاعدة البيانات');
    }
  }, [rawClickData, useLocalData]);

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
    console.log(`⚡ نقرة سريعة على الصورة ${imageNum} من ${country}`);
    handleOptimisticClick(imageNum, country);
    
    // تحديث البيانات من قاعدة البيانات بعد 3 ثواني من النقر
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['stats'] });
    }, 3000);
  }, [handleOptimisticClick, queryClient]);

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
