
import fs from 'fs';
import path from 'path';

console.log('🔍 فحص جاهزية المشروع للإنتاج...\n');

let allGood = true;

// فحص الملفات الأساسية
const requiredFiles = [
  'server.js',
  '.env',
  'src/config/constants.ts',
  'vite.config.ts'
];

console.log('📁 فحص الملفات الأساسية:');
requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ ${file} - مفقود`);
    allGood = false;
  }
});

// فحص مجلدات التحميل
console.log('\n📂 فحص مجلدات التحميل:');
const uploadDirs = [
  'public/uploads',
  'public/uploads/images',
  'public/uploads/sounds'
];

uploadDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}`);
  } else {
    console.log(`❌ ${dir} - مفقود`);
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`✅ تم إنشاء ${dir}`);
    } catch (error) {
      console.log(`❌ فشل في إنشاء ${dir}`);
      allGood = false;
    }
  }
});

// فحص ملف .env
console.log('\n🔧 فحص إعدادات البيئة:');
if (fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_NAME', 'EMAIL_USER', 'ADMIN_REGISTER_SECRET'];
  
  requiredEnvVars.forEach(varName => {
    if (envContent.includes(varName)) {
      console.log(`✅ ${varName}`);
    } else {
      console.log(`❌ ${varName} - مفقود في .env`);
      allGood = false;
    }
  });
}

// فحص constants.ts
console.log('\n🌐 فحص إعدادات API:');
if (fs.existsSync('src/config/constants.ts')) {
  const constantsContent = fs.readFileSync('src/config/constants.ts', 'utf8');
  if (constantsContent.includes('wajhne.com')) {
    console.log('✅ API_BASE_URL مضبوط للإنتاج');
  } else {
    console.log('⚠️  API_BASE_URL قد يحتاج تحديث للإنتاج');
  }
}

// فحص vite.config.ts
console.log('\n⚙️  فحص إعدادات Vite:');
if (fs.existsSync('vite.config.ts')) {
  const viteContent = fs.readFileSync('vite.config.ts', 'utf8');
  if (viteContent.includes('port: 8080')) {
    console.log('✅ منفذ التطوير مضبوط على 8080');
  } else {
    console.log('⚠️  قد تحتاج لضبط المنفذ على 8080');
  }
}

// النتيجة النهائية
console.log('\n' + '='.repeat(50));
if (allGood) {
  console.log('🎉 المشروع جاهز للإنتاج!');
  console.log('\nالخطوات التالية:');
  console.log('1. قم بتشغيل: node update-config-for-production.js');
  console.log('2. قم بتشغيل: node build-for-production.js');
  console.log('3. اتبع التعليمات في deployment-guide.md');
} else {
  console.log('❌ هناك مشاكل تحتاج إصلاح قبل النشر');
}
console.log('='.repeat(50));
