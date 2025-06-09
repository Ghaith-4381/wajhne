
import { execSync } from 'child_process';
import fs from 'fs';

console.log('🚀 بدء تشغيل المشروع محلياً...');

try {
  // التأكد من أن المنفذ 5000 متاح للخادم
  console.log('🔧 فحص إعدادات التطوير...');
  
  // التأكد من وجود مجلدات التحميل
  const uploadDirs = [
    'public/uploads',
    'public/uploads/images', 
    'public/uploads/sounds'
  ];
  
  uploadDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ تم إنشاء مجلد: ${dir}`);
    }
  });

  console.log('');
  console.log('🎯 تعليمات التشغيل:');
  console.log('1. افتح terminal أول وشغل: node server.js');
  console.log('2. افتح terminal ثاني وشغل: npm run dev');
  console.log('3. الموقع سيعمل على: http://localhost:8080');
  console.log('4. السيرفر سيعمل على: http://localhost:5000');
  console.log('');
  console.log('📌 ملاحظة: تأكد من تشغيل الخادم أولاً ثم الموقع');

} catch (error) {
  console.error('❌ خطأ:', error);
}
