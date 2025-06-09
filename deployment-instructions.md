
# دليل رفع الموقع على الاستضافة - مبسط

## الخطوات السريعة

### 1. تحضير المشروع محلياً
```bash
# تشغيل سكريبت التحضير
node prepare-production.js

# أو يدوياً
npm run build
```

### 2. رفع الملفات
- ارفع جميع محتويات مجلد `dist/` إلى `public_html/` في الاستضافة
- أو ارفع الملفات الأساسية:
  - جميع ملفات البناء (من dist/)
  - server.js
  - مجلد server/
  - مجلد public/
  - package.json
  - .env

### 3. إعداد قاعدة البيانات
```sql
-- في phpMyAdmin أو MySQL
CREATE DATABASE wajhne_db;
-- ثم ارفع ملف production-database-setup.sql
```

### 4. تحديث ملف .env
```env
DB_HOST=localhost
DB_USER=اسم_المستخدم_من_الاستضافة
DB_PASS=كلمة_المرور_من_الاستضافة
DB_NAME=wajhne_db
EMAIL_USER=ghaithalmohammad@gmail.com
EMAIL_PASS=dpniuhbgbstgckjd
ADMIN_REGISTER_SECRET=MySuperSecretKey2024
PORT=3000
```

### 5. تثبيت الحزم وتشغيل الموقع
```bash
# في Terminal الاستضافة
cd public_html
npm install
npm start

# أو مع PM2
npm install -g pm2
pm2 start server.js --name wajhne-app
```

### 6. اختبار الموقع
- اذهب إلى: `https://yourdomain.com`
- لوحة الإدارة: `https://yourdomain.com/admin-4Bxr7Xt89-secure`

## في حالة المشاكل

### إذا لم يعمل الموقع:
```bash
pm2 logs wajhne-app
# أو
npm start
```

### إذا كانت مشكلة قاعدة البيانات:
- تحقق من إعدادات .env
- تأكد من إنشاء قاعدة البيانات
- تأكد من صلاحيات المستخدم

## ملاحظات مهمة
- غير كلمات المرور الافتراضية
- تأكد من تشغيل SSL
- عمل نسخة احتياطية دورية
