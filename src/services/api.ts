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

// تسجيل النقرة مع ضمان الحفظ في قاعدة البيانات
export const registerClick = async (
  imageId: number, 
  country: string
): Promise<number> => {
  try {
    console.log(`💾 بدء حفظ النقرة: الصورة ${imageId}, الدولة: ${country}`);
    
    // 1. تسجيل النقرة في جدول click_events
    const { error: clickEventError } = await supabase
      .from('click_events')
      .insert({
        image_id: imageId,
        country: country
      });

    if (clickEventError) {
      console.error('خطأ في تسجيل حدث النقر:', clickEventError);
      throw clickEventError;
    }
    console.log(`✅ تم تسجيل حدث النقر بنجاح`);

    // 2. تحديث إحصائيات الصورة
    const { error: incrementError } = await supabase.rpc('increment_image_clicks', { 
      img_id: imageId 
    });

    if (incrementError) {
      console.error('خطأ في تحديث إحصائيات الصورة:', incrementError);
      throw incrementError;
    }
    console.log(`✅ تم تحديث إحصائيات الصورة ${imageId}`);

    // 3. تحديث أو إدراج إحصائيات الدولة
    const { data: existingCountryStats, error: fetchError } = await supabase
      .from('country_stats')
      .select('*')
      .eq('image_id', imageId)
      .eq('country', country)
      .maybeSingle();

    if (fetchError) {
      console.error('خطأ في جلب إحصائيات الدولة:', fetchError);
      throw fetchError;
    }

    if (existingCountryStats) {
      // تحديث الإحصائيات الموجودة
      const { error: updateError } = await supabase
        .from('country_stats')
        .update({ clicks: existingCountryStats.clicks + 1 })
        .eq('id', existingCountryStats.id);

      if (updateError) {
        console.error('خطأ في تحديث إحصائيات الدولة:', updateError);
        throw updateError;
      }
      console.log(`✅ تم تحديث إحصائيات الدولة ${country}: ${existingCountryStats.clicks + 1}`);
    } else {
      // إدراج إحصائيات جديدة للدولة
      const { error: insertError } = await supabase
        .from('country_stats')
        .insert({
          image_id: imageId,
          country: country,
          clicks: 1
        });

      if (insertError) {
        console.error('خطأ في إدراج إحصائيات الدولة:', insertError);
        throw insertError;
      }
      console.log(`✅ تم إنشاء إحصائيات جديدة للدولة ${country}: 1`);
    }

    // 4. جلب العدد الجديد للنقرات للتأكيد
    const { data: imageStats, error: statsError } = await supabase
      .from('image_stats')
      .select('total_clicks')
      .eq('image_id', imageId)
      .single();

    if (statsError) {
      console.error('خطأ في جلب إحصائيات الصورة:', statsError);
      throw statsError;
    }

    const newTotal = imageStats?.total_clicks || 0;
    console.log(`🎉 تم حفظ النقرة بنجاح! المجموع الجديد للصورة ${imageId}: ${newTotal}`);
    return newTotal;
    
  } catch (error) {
    console.error('❌ خطأ في تسجيل النقرة:', error);
    throw error;
  }
};

// جلب الإحصائيات مع معالجة أفضل للأخطاء
export const fetchStats = async (): Promise<CountryStatsData> => {
  try {
    console.log('📥 جلب الإحصائيات من قاعدة البيانات...');
    
    // جلب إحصائيات الصور
    const { data: imageStats, error: imageError } = await supabase
      .from('image_stats')
      .select('*')
      .in('image_id', [1, 2]);

    if (imageError) {
      console.error('خطأ في جلب إحصائيات الصور:', imageError);
      throw imageError;
    }

    // جلب إحصائيات الدول
    const { data: countryStats, error: countryError } = await supabase
      .from('country_stats')
      .select('*')
      .in('image_id', [1, 2]);

    if (countryError) {
      console.error('خطأ في جلب إحصائيات الدول:', countryError);
      throw countryError;
    }

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

    const result = {
      image1: {
        total: Number(image1Stats?.total_clicks || 0),
        countries: image1Countries
      },
      image2: {
        total: Number(image2Stats?.total_clicks || 0),
        countries: image2Countries
      }
    };

    console.log('✅ تم جلب الإحصائيات بنجاح:', result);
    return result;
    
  } catch (error) {
    console.error('❌ خطأ في جلب الإحصائيات:', error);
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
