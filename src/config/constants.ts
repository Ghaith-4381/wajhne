
// إعدادات API للإنتاج والتطوير
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://wajhne.com' 
  : '';

export const ENDPOINTS = {
  CLICK_IMAGE: '/api/click',
  GET_STATS: '/api/stats',
  GET_IMAGES: '/api/images'
};
