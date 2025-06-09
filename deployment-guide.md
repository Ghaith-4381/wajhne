
# دليل رفع المشروع على استضافة Namecheap

## المتطلبات الأساسية

### على الخادم:
- Node.js (الإصدار 18 أو أعلى)
- MySQL (الإصدار 8 أو أعلى)
- PM2 (لإدارة التطبيق)

## خطوات الرفع المفصلة

### 1. تجهيز المشروع محلياً

```bash
# بناء المشروع للإنتاج
node build-for-production.js
```

### 2. رفع الملفات إلى الخادم

#### الطريقة 1: عبر cPanel File Manager
1. اذهب إلى cPanel الخاص بك
2. افتح File Manager
3. اذهب إلى مجلد `public_html`
4. احذف جميع الملفات الموجودة (إذا لم تكن هناك مواقع أخرى)
5. ارفع جميع محتويات مجلد `dist/` إلى `public_html`

#### الطريقة 2: عبر FTP
```bash
# استخدم FileZilla أو أي برنامج FTP
# رفع محتويات مجلد dist/ إلى public_html/
```

### 3. إعداد قاعدة البيانات

#### في cPanel:
1. اذهب إلى MySQL Databases
2. أنشئ قاعدة بيانات جديدة باسم: `wajhne_db`
3. أنشئ مستخدم جديد وأعطه صلاحيات كاملة
4. في phpMyAdmin، اختر قاعدة البيانات وارفع ملف `production-database-setup.sql`

### 4. إعداد متغيرات البيئة

قم بتحديث ملف `.env` على الخادم:

```env
# إعدادات قاعدة البيانات (سيتم تحديثها حسب إعدادات Namecheap)
DB_HOST=localhost
DB_USER=wajhne_dbuser
DB_PASS=كلمة_المرور_التي_أنشأتها
DB_NAME=wajhne_db

# إعدادات البريد الإلكتروني
EMAIL_USER=ghaithalmohammad@gmail.com
EMAIL_PASS=dpniuhbgbstgckjd

# مفتاح تسجيل المشرف
ADMIN_REGISTER_SECRET=MySuperSecretKey2024

# المنفذ (سيحدده Namecheap تلقائياً)
PORT=3000
```

### 5. تثبيت الحزم على الخادم

#### عبر Terminal في cPanel:
```bash
cd public_html
npm install
```

#### أو عبر SSH:
```bash
ssh username@wajhne.com
cd public_html
npm install
```

### 6. تشغيل التطبيق

#### الطريقة المفضلة (مع PM2):
```bash
# تثبيت PM2 عالمياً
npm install -g pm2

# تشغيل التطبيق
npm run pm2:start

# للتحقق من الحالة
pm2 status

# لعرض اللوجز
pm2 logs wajhne-app
```

#### الطريقة البديلة:
```bash
npm start
```

### 7. إعداد Node.js في Namecheap

#### في cPanel:
1. اذهب إلى "Node.js Selector" أو "Node.js App"
2. أنشئ تطبيق Node.js جديد
3. اختر النسخة 18 أو أعلى
4. حدد المجلد: `public_html`
5. حدد ملف البداية: `server.js`
6. اضغط "Create"

### 8. إعداد DNS والدومين

#### في Namecheap Domain Panel:
1. اذهب إلى "Advanced DNS"
2. تأكد من أن A Record يشير إلى IP الخادم
3. أضف CNAME للـ www إذا لزم الأمر

### 9. إعداد SSL Certificate

#### في cPanel:
1. اذهب إلى "SSL/TLS"
2. فعل "Let's Encrypt SSL"
3. أو ارفع شهادة SSL مخصصة

### 10. اختبار التطبيق

1. اذهب إلى `https://wajhne.com`
2. تأكد من عمل الموقع
3. جرب تسجيل الدخول للوحة الإدارة: `https://wajhne.com/admin-4Bxr7Xt89-secure`

## استكشاف الأخطاء وإصلاحها

### إذا لم يعمل الموقع:

```bash
# تحقق من لوجز PM2
pm2 logs wajhne-app

# أو تحقق من لوجز Node.js في cPanel
```

### إذا كانت هناك مشاكل في قاعدة البيانات:
1. تحقق من إعدادات الاتصال في `.env`
2. تأكد من أن المستخدم له صلاحيات كاملة
3. تحقق من أن قاعدة البيانات تم إنشاؤها بالاسم الصحيح

### إذا كانت هناك مشاكل في الملفات المرفوعة:
```bash
# تأكد من صلاحيات المجلدات
chmod 755 public/uploads
chmod 755 public/uploads/images
chmod 755 public/uploads/sounds
```

## ملاحظات مهمة

1. **النسخ الاحتياطية**: قم بعمل نسخة احتياطية قبل أي تحديث
2. **الأمان**: غير المفاتيح الافتراضية في بيئة الإنتاج
3. **المراقبة**: استخدم PM2 لمراقبة أداء التطبيق
4. **التحديثات**: لتحديث التطبيق، كرر عملية البناء والرفع

## أوامر مفيدة للصيانة

```bash
# إعادة تشغيل التطبيق
pm2 restart wajhne-app

# إيقاف التطبيق
pm2 stop wajhne-app

# عرض معلومات التطبيق
pm2 show wajhne-app

# عرض استخدام الموارد
pm2 monit
```

## الدعم

إذا واجهت أي مشاكل:
1. تحقق من لوجز الأخطاء
2. تأكد من إعدادات قاعدة البيانات
3. تحقق من صلاحيات الملفات
4. تواصل مع دعم Namecheap إذا لزم الأمر
