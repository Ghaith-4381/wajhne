
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 بدء تجهيز المشروع للإنتاج...');

try {
  // 1. تنظيف ملفات البناء السابقة
  console.log('🧹 تنظيف ملفات البناء السابقة...');
  if (fs.existsSync('dist')) {
    fs.rmSync('dist', { recursive: true, force: true });
  }

  // 2. بناء Frontend
  console.log('🔨 بناء Frontend...');
  execSync('npm run build', { stdio: 'inherit' });

  // 3. نسخ ملفات الخادم
  console.log('📁 نسخ ملفات الخادم...');
  const serverFiles = [
    'server.js',
    'ecosystem.config.js',
    '.env'
  ];

  serverFiles.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
    }
  });

  // 4. نسخ مجلد server
  if (fs.existsSync('server')) {
    fs.cpSync('server', path.join('dist', 'server'), { recursive: true });
  }

  // 5. نسخ مجلد public/uploads إذا كان موجوداً
  if (fs.existsSync('public/uploads')) {
    if (!fs.existsSync('dist/public')) {
      fs.mkdirSync('dist/public', { recursive: true });
    }
    fs.cpSync('public/uploads', path.join('dist', 'public', 'uploads'), { recursive: true });
  }

  // 6. إنشاء ملف package.json للإنتاج
  const productionPackage = {
    "name": "wajhne-production",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "start": "node server.js",
      "pm2:start": "pm2 start ecosystem.config.js --env production",
      "pm2:stop": "pm2 stop wajhne-app",
      "pm2:restart": "pm2 restart wajhne-app"
    },
    "dependencies": {
      "express": "^4.21.2",
      "mysql2": "^3.14.1",
      "cors": "^2.8.5",
      "dotenv": "^16.5.0",
      "bcryptjs": "^3.0.2",
      "multer": "^1.4.5-lts.2",
      "express-rate-limit": "^7.5.0",
      "nodemailer": "^7.0.3",
      "uuid": "^11.1.0"
    }
  };

  fs.writeFileSync(
    path.join('dist', 'package.json'),
    JSON.stringify(productionPackage, null, 2)
  );

  console.log('✅ تم تجهيز المشروع بنجاح!');
  console.log('📂 جميع الملفات جاهزة في مجلد dist/');
  console.log('');
  console.log('🚀 خطوات الرفع على الاستضافة:');
  console.log('1. ارفع محتويات مجلد dist/ إلى public_html/');
  console.log('2. قم بتشغيل: npm install');
  console.log('3. تأكد من إعدادات قاعدة البيانات في .env');
  console.log('4. قم بتشغيل: npm start');

} catch (error) {
  console.error('❌ خطأ في تجهيز المشروع:', error);
  process.exit(1);
}
