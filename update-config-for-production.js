
import fs from 'fs';
import path from 'path';

console.log('🔧 تحديث إعدادات الإنتاج...');

// تحديث src/config/constants.ts
const constantsPath = 'src/config/constants.ts';
const constantsContent = `
// API Base URL for production
export const API_BASE_URL = "https://wajhne.com";

// API Endpoints
export const ENDPOINTS = {
  CLICK_IMAGE: "/api/click",
  GET_STATS: "/api/stats",
  UPLOAD_IMAGE: "/api/upload-image",
  UPLOAD_SOUND: "/api/upload-sound",
  ADMIN_LOGIN: "/api/admin-4Bxr7Xt89/login",
  ADMIN_REGISTER: "/api/admin-4Bxr7Xt89/register"
};
`;

fs.writeFileSync(constantsPath, constantsContent.trim());
console.log('✅ تم تحديث constants.ts للإنتاج');

// تحديث vite.config.ts للإنتاج
const viteConfigPath = 'vite.config.ts';
let viteContent = fs.readFileSync(viteConfigPath, 'utf8');

// التأكد من أن المنفذ 8080 موجود
if (!viteContent.includes('port: 8080')) {
  viteContent = viteContent.replace(
    'server: {',
    `server: {
    port: 8080,`
  );
}

fs.writeFileSync(viteConfigPath, viteContent);
console.log('✅ تم تحديث vite.config.ts');

console.log('✅ تم تحديث جميع الإعدادات للإنتاج');
