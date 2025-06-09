
# تعليمات إعداد الخادم وقاعدة البيانات MySQL

## هيكل قاعدة البيانات

قم بإنشاء قاعدة بيانات جديدة باستخدام الاستعلام التالي:

```sql
CREATE DATABASE IF NOT EXISTS click_challenge;

USE click_challenge;

-- جدول لتخزين إحصائيات النقرات الكلية
CREATE TABLE IF NOT EXISTS image_stats (
  image_id INT PRIMARY KEY,
  total_clicks BIGINT DEFAULT 0
);

-- جدول لتخزين إحصائيات النقرات حسب البلد
CREATE TABLE IF NOT EXISTS country_stats (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_id INT NOT NULL,
  country VARCHAR(100) NOT NULL,
  clicks BIGINT DEFAULT 0,
  UNIQUE KEY (image_id, country)
);

-- إدخال البيانات الابتدائية
INSERT INTO image_stats (image_id, total_clicks) VALUES (1, 0), (2, 0);
```

## إنشاء واجهة برمجة التطبيقات API

قم بإنشاء خادم Node.js باستخدام Express لتوفير نقاط النهاية API التالية:

### 1. تسجيل النقرات

```
POST /api/click
```

الجسم:
```json
{
  "imageId": 1 أو 2,
  "country": "اسم البلد"
}
```

الإجراء:
1. زيادة عدد النقرات الكلي للصورة في جدول `image_stats`
2. زيادة عدد النقرات للبلد المحدد والصورة في جدول `country_stats`
3. إعادة العدد الكلي للنقرات المحدث

### 2. جلب الإحصائيات

```
GET /api/stats
```

الإجراء:
1. استرجاع إجمالي النقرات لكل صورة من `image_stats`
2. استرجاع إحصائيات البلدان من `country_stats`
3. إعادة البيانات بالتنسيق التالي:

```json
{
  "image1": {
    "total": 1234567,
    "countries": {
      "Syria": 123456,
      "Egypt": 234567,
      ...
    }
  },
  "image2": {
    "total": 7654321,
    "countries": {
      "Syria": 654321,
      "Egypt": 765432,
      ...
    }
  }
}
```

## مثال على خادم Express

```javascript
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
const port = 3001;

// إعدادات قاعدة البيانات
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'click_challenge3',
};

// الوسائط
app.use(cors());
app.use(express.json());

// إنشاء تجمع اتصالات قاعدة البيانات
const pool = mysql.createPool(dbConfig);

// تسجيل نقرة
app.post('/api/click', async (req, res) => {
  try {
    const { imageId, country } = req.body;
    
    if (![1, 2].includes(imageId) || !country) {
      return res.status(400).json({ error: 'Invalid input data' });
    }
    
    const conn = await pool.getConnection();
    
    try {
      // بدء المعاملة
      await conn.beginTransaction();
      
      // تحديث العدد الكلي للصورة
      await conn.execute(
        'UPDATE image_stats SET total_clicks = total_clicks + 1 WHERE image_id = ?',
        [imageId]
      );
      
      // تحديث عدد البلد للصورة
      await conn.execute(
        `INSERT INTO country_stats (image_id, country, clicks) 
         VALUES (?, ?, 1) 
         ON DUPLICATE KEY UPDATE clicks = clicks + 1`,
        [imageId, country]
      );
      
      // استرجاع العدد الكلي الجديد
      const [rows] = await conn.execute(
        'SELECT total_clicks FROM image_stats WHERE image_id = ?',
        [imageId]
      );
      
      // تأكيد المعاملة
      await conn.commit();
      
      return res.json({ totalClicks: rows[0].total_clicks });
    } catch (error) {
      // التراجع عن المعاملة في حالة الخطأ
      await conn.rollback();
      throw error;
    } finally {
      // إطلاق الاتصال
      conn.release();
    }
  } catch (error) {
    console.error('Error in click endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// جلب الإحصائيات
app.get('/api/stats', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    try {
      // استرجاع العدد الكلي للصور
      const [totalStatsRows] = await conn.execute('SELECT * FROM image_stats');
      
      // استرجاع إحصائيات البلدان
      const [countryStatsRows] = await conn.execute('SELECT * FROM country_stats');
      
      // تنظيم البيانات
      const result = {
        image1: { total: 0, countries: {} },
        image2: { total: 0, countries: {} }
      };
      
      // إضافة العدد الكلي للنقرات
      for (const row of totalStatsRows) {
        if (row.image_id === 1) {
          result.image1.total = Number(row.total_clicks);
        } else if (row.image_id === 2) {
          result.image2.total = Number(row.total_clicks);
        }
      }
      
      // إضافة إحصائيات البلدان
      for (const row of countryStatsRows) {
        if (row.image_id === 1) {
          result.image1.countries[row.country] = Number(row.clicks);
        } else if (row.image_id === 2) {
          result.image2.countries[row.country] = Number(row.clicks);
        }
      }
      
      return res.json(result);
    } finally {
      // إطلاق الاتصال
      conn.release();
    }
  } catch (error) {
    console.error('Error in stats endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// بدء تشغيل الخادم
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
```

## الحزم المطلوبة للخادم

- express
- mysql2
- cors

## تثبيت

```bash
npm init -y
npm install express mysql2 cors
```

## تشغيل

```bash
node server.js
```

ملاحظة: لا تنس تغيير معلومات الاتصال بقاعدة البيانات في متغير `dbConfig` حسب إعدادات قاعدة بيانات MySQL الخاصة بك.
