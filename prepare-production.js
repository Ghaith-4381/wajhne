
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 تحضير المشروع للإنتاج...\n');

try {
  // 1. بناء المشروع
  console.log('📦 بناء المشروع...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // 2. نسخ الملفات المطلوبة
  console.log('📁 نسخ الملفات...');
  
  const filesToCopy = [
    'server.js',
    'package.json',
    '.env',
    'production-database-setup.sql'
  ];
  
  const dirsToCopy = [
    'server',
    'public'
  ];
  
  // إنشاء مجلد dist إذا لم يكن موجوداً
  if (!fs.existsSync('dist')) {
    fs.mkdirSync('dist');
  }
  
  // نسخ الملفات
  filesToCopy.forEach(file => {
    if (fs.existsSync(file)) {
      fs.copyFileSync(file, path.join('dist', file));
      console.log(`✅ تم نسخ ${file}`);
    }
  });
  
  // نسخ المجلدات
  function copyDir(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    
    const entries = fs.readdirSync(src, { withFileTypes: true });
    
    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      
      if (entry.isDirectory()) {
        copyDir(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
  
  dirsToCopy.forEach(dir => {
    if (fs.existsSync(dir)) {
      copyDir(dir, path.join('dist', dir));
      console.log(`✅ تم نسخ مجلد ${dir}`);
    }
  });
  
  // 3. إنشاء ملف package.json مبسط للإنتاج
  const originalPackage = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const productionPackage = {
    name: originalPackage.name,
    version: originalPackage.version,
    main: 'server.js',
    scripts: {
      start: 'node server.js',
      'pm2:start': 'pm2 start server.js --name wajhne-app'
    },
    dependencies: originalPackage.dependencies
  };
  
  fs.writeFileSync(
    path.join('dist', 'package.json'), 
    JSON.stringify(productionPackage, null, 2)
  );
  
  console.log('\n🎉 تم تحضير المشروع للإنتاج بنجاح!');
  console.log('📁 جميع الملفات جاهزة في مجلد dist/');
  
} catch (error) {
  console.error('❌ خطأ في تحضير المشروع:', error.message);
  process.exit(1);
}
