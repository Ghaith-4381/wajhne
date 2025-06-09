
import { useState, useEffect, useRef } from 'react';
import { fetchStats, CountryStatsData } from "../services/api";

interface RealTimeSyncOptions {
  interval?: number; // بالميلي ثانية
  enabled?: boolean;
}

export const useRealTimeSync = (
  localData: CountryStatsData,
  options: RealTimeSyncOptions = {}
) => {
  const { interval = 2000, enabled = true } = options;
  const [globalData, setGlobalData] = useState<CountryStatsData>(localData);
  const [lastSyncTime, setLastSyncTime] = useState<number>(Date.now());
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // دمج البيانات المحلية مع العالمية
  const mergeData = (global: CountryStatsData, local: CountryStatsData): CountryStatsData => {
    return {
      image1: {
        // اختر الأكبر بين المحلي والعالمي لضمان عدم التراجع
        total: Math.max(global.image1.total, local.image1.total),
        countries: {
          ...global.image1.countries,
          // دمج البيانات المحلية إذا كانت أكبر
          ...Object.fromEntries(
            Object.entries(local.image1.countries).map(([country, count]) => [
              country,
              Math.max(count, global.image1.countries[country] || 0)
            ])
          )
        }
      },
      image2: {
        total: Math.max(global.image2.total, local.image2.total),
        countries: {
          ...global.image2.countries,
          ...Object.fromEntries(
            Object.entries(local.image2.countries).map(([country, count]) => [
              country,
              Math.max(count, global.image2.countries[country] || 0)
            ])
          )
        }
      }
    };
  };

  // مزامنة البيانات مع السيرفر
  const syncWithServer = async () => {
    if (!enabled) return;
    
    try {
      console.log("🔄 مزامنة السكور العالمي...");
      const serverData = await fetchStats();
      
      // دمج البيانات المحلية مع العالمية
      const mergedData = mergeData(serverData, localData);
      
      setGlobalData(mergedData);
      setLastSyncTime(Date.now());
      
      console.log("✅ تم تحديث السكور العالمي:", {
        image1: mergedData.image1.total,
        image2: mergedData.image2.total
      });
    } catch (error) {
      console.error("❌ خطأ في مزامنة السكور:", error);
    }
  };

  // بدء المزامنة الدورية
  useEffect(() => {
    if (!enabled) return;

    // مزامنة فورية عند البداية
    syncWithServer();

    // مزامنة دورية
    syncIntervalRef.current = setInterval(syncWithServer, interval);

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [enabled, interval]);

  // تحديث البيانات المدمجة عند تغيير البيانات المحلية
  useEffect(() => {
    const mergedData = mergeData(globalData, localData);
    if (JSON.stringify(mergedData) !== JSON.stringify(globalData)) {
      setGlobalData(mergedData);
    }
  }, [localData]);

  return {
    syncedData: globalData,
    lastSyncTime,
    isOnline: enabled,
    forceSync: syncWithServer
  };
};
