
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchStats, registerClick, CountryStatsData } from "../services/api";
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
  const queryClient = useQueryClient();

  const { data: rawClickData, isLoading, error } = useQuery({
    queryKey: ['stats'],
    queryFn: fetchStats,
    refetchInterval: 2000,
    retry: 1,
    staleTime: 1000,
    initialData: createSafeInitialData
  });

  const safeClickData = ensureDataSafety(rawClickData);
  const clickData = useLocalData ? fallbackData : safeClickData;

  if (error && !useLocalData) {
    console.log("Using fallback data due to API error:", error);
    setUseLocalData(true);
  }

  const clickMutation = useMutation({
    mutationFn: ({ imageId, country, securityData }: { 
      imageId: number, 
      country: string,
      securityData?: { isTrusted: boolean; timestamp: number }
    }) => registerClick(imageId, country, securityData),
    
    onMutate: async ({ imageId, country }) => {
      await queryClient.cancelQueries({ queryKey: ['stats'] });
      const previousData = queryClient.getQueryData(['stats']);
      const safePreviousData = ensureDataSafety(previousData);
      
      queryClient.setQueryData(['stats'], (old: any) => {
        const safeOld = ensureDataSafety(old);
        const imageKey = imageId === 1 ? 'image1' : 'image2';
        
        return {
          ...safeOld,
          [imageKey]: {
            ...safeOld[imageKey],
            total: safeOld[imageKey].total + 1,
            countries: {
              ...safeOld[imageKey].countries,
              [country]: (safeOld[imageKey].countries[country] || 0) + 1
            }
          }
        };
      });
      
      return { previousData: safePreviousData };
    },
    
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(['stats'], context.previousData);
      }
      setUseLocalData(true);
    },
    
    onSettled: () => {
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ['stats'] });
      }, 500);
    }
  });

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

  const handleImageClick = useCallback((imageNum: number, country: string, securityData?: { isTrusted: boolean; timestamp: number }) => {
    clickMutation.mutate({ 
      imageId: imageNum, 
      country,
      securityData
    });
  }, [clickMutation]);

  return {
    clickData,
    isLoading,
    useLocalData,
    handleImageClick,
    image1Percentage,
    image2Percentage,
    totalClicks,
    topCountry,
    isUpdating: clickMutation.isPending
  };
};
