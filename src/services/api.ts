
import { supabase } from "@/integrations/supabase/client";

export interface ClickData {
  imageId: number;
  country: string;
}

export interface CountryStatsData {
  image1: {
    total: number;
    countries: Record<string, number>;
  };
  image2: {
    total: number;
    countries: Record<string, number>;
  };
}

// تسجيل النقرة مع تحسينات السرعة
export const registerClick = async (
  imageId: number, 
  country: string, 
  securityData?: { isTrusted: boolean; timestamp: number }
): Promise<number> => {
  try {
    // تسجيل النقرة في جدول click_events
    await supabase
      .from('click_events')
      .insert({
        image_id: imageId,
        country: country
      });

    // تحديث إحصائيات الصورة
    await supabase.rpc('increment_image_clicks', { img_id: imageId });

    // تحديث أو إدراج إحصائيات الدولة
    const { data: existingCountryStats } = await supabase
      .from('country_stats')
      .select('*')
      .eq('image_id', imageId)
      .eq('country', country)
      .single();

    if (existingCountryStats) {
      await supabase
        .from('country_stats')
        .update({ clicks: existingCountryStats.clicks + 1 })
        .eq('id', existingCountryStats.id);
    } else {
      await supabase
        .from('country_stats')
        .insert({
          image_id: imageId,
          country: country,
          clicks: 1
        });
    }

    // جلب العدد الجديد للنقرات
    const { data: imageStats } = await supabase
      .from('image_stats')
      .select('total_clicks')
      .eq('image_id', imageId)
      .single();

    return imageStats?.total_clicks || 0;
  } catch (error) {
    console.error('Error registering click:', error);
    return 0;
  }
};

// جلب الإحصائيات مع cache
export const fetchStats = async (): Promise<CountryStatsData> => {
  try {
    // جلب إحصائيات الصور
    const { data: imageStats, error: imageError } = await supabase
      .from('image_stats')
      .select('*')
      .in('image_id', [1, 2]);

    if (imageError) throw imageError;

    // جلب إحصائيات الدول
    const { data: countryStats, error: countryError } = await supabase
      .from('country_stats')
      .select('*')
      .in('image_id', [1, 2]);

    if (countryError) throw countryError;

    // تنظيم البيانات
    const image1Stats = imageStats?.find(stat => stat.image_id === 1);
    const image2Stats = imageStats?.find(stat => stat.image_id === 2);

    const image1Countries = countryStats
      ?.filter(stat => stat.image_id === 1)
      ?.reduce((acc, stat) => {
        acc[stat.country] = Number(stat.clicks);
        return acc;
      }, {} as Record<string, number>) || {};

    const image2Countries = countryStats
      ?.filter(stat => stat.image_id === 2)
      ?.reduce((acc, stat) => {
        acc[stat.country] = Number(stat.clicks);
        return acc;
      }, {} as Record<string, number>) || {};

    return {
      image1: {
        total: Number(image1Stats?.total_clicks || 0),
        countries: image1Countries
      },
      image2: {
        total: Number(image2Stats?.total_clicks || 0),
        countries: image2Countries
      }
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    throw error;
  }
};

// جلب المسارات
export const fetchImages = async (): Promise<any> => {
  try {
    const { data: imageStats, error } = await supabase
      .from('image_stats')
      .select('*')
      .in('image_id', [1, 2]);

    if (error) throw error;

    const result = {
      image1: null as any,
      image2: null as any
    };

    imageStats?.forEach(stat => {
      const imageData = {
        default: stat.image_path,
        pressed: stat.pressed_image_path,
        sound: stat.sound_path
      };

      if (stat.image_id === 1) {
        result.image1 = imageData;
      } else if (stat.image_id === 2) {
        result.image2 = imageData;
      }
    });

    return result;
  } catch (error) {
    console.error("Error fetching image paths:", error);
    throw error;
  }
};
