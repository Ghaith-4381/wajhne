
import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export const useImageRefresh = () => {
  const queryClient = useQueryClient();

  const refreshImages = useCallback(() => {
    // إعادة تحميل بيانات الصور
    queryClient.invalidateQueries({ queryKey: ['images'] });
    
    // إجبار إعادة تحميل الصور عن طريق إضافة timestamp
    const timestamp = Date.now();
    const images = document.querySelectorAll('img');
    images.forEach(img => {
      if (img.src.includes('/uploads/')) {
        const url = new URL(img.src);
        url.searchParams.set('t', timestamp.toString());
        img.src = url.toString();
      }
    });
  }, [queryClient]);

  return { refreshImages };
};
