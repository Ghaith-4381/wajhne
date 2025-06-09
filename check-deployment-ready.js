
const fs = require('fs');
const path = require('path');

console.log('🔍 فحص جاهزية المشروع للرفع على الاستضافة...\n');

const checks = [
  {
    name: 'فحص ملف package.json',
    check: () => fs.existsSync('package.json'),
    fix: 'تأكد من وجود ملف package.json'
  },
  {
    name: 'فحص مجلد dist',
    check: () => fs.existsSync('dist'),
    fix: 'قم بتشغيل: npm run build'
  },
  {
    name: 'فحص ملف server.js',
    check: () => fs.existsSync('server.js'),
    fix: 'تأكد من وجود ملف server.js'
  },
  {
    name: 'فحص مجلد server',
    check: () => fs.existsSync('server'),
    fix: 'تأكد من وجود مجلد server'
  },
  {
    name: 'فحص ملف .env',
    check: () => fs.existsSync('.env') || fs.existsSync('.env.production'),
    fix: 'أنشئ ملف .env مع إعدادات قاعدة البيانات'
  }
];

let allPassed = true;

checks.forEach(({ name, check, fix }) => {
  const passed = check();
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  
  if (!passed) {
    console.log(`   💡 ${fix}`);
    allPassed = false;
  }
});

console.log('\n' + '='.repeat(50));

if (allPassed) {
  console.log('🎉 المشروع جاهز للرفع على الاستضافة!');
  console.log('\nالخطوات التالية:');
  console.log('1. ارفع جميع ملفات المشروع إلى الخادم');
  console.log('2. قم بتثبيت الحزم: npm install');
  console.log('3. أنشئ قاعدة البيانات وارفع ملف production-database-setup.sql');
  console.log('4. حدث ملف .env بإعدادات قاعدة البيانات الصحيحة');
  console.log('5. شغل الخادم: npm start أو pm2 start server.js');
} else {
  console.log('⚠️  هناك مشاكل يجب حلها قبل الرفع');
}
