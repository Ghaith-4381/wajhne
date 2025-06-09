
-- إعداد قاعدة البيانات للإنتاج
-- استخدم هذا الملف في phpMyAdmin أو MySQL

CREATE DATABASE IF NOT EXISTS GGGG CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE GGGG;

-- جدول الإحصائيات
CREATE TABLE IF NOT EXISTS click_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_number INT NOT NULL,
    country VARCHAR(100) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    INDEX idx_country (country),
    INDEX idx_timestamp (timestamp),
    INDEX idx_image (image_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- جدول المشرفين
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(100),
    verification_expires TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- جدول الحظر
CREATE TABLE IF NOT EXISTS banned_ips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    reason VARCHAR(255),
    banned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    banned_until TIMESTAMP NULL,
    is_permanent BOOLEAN DEFAULT FALSE,
    banned_by VARCHAR(50),
    INDEX idx_ip (ip_address),
    INDEX idx_banned_until (banned_until)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- جدول مراقبة النقرات
CREATE TABLE IF NOT EXISTS click_monitoring (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    click_count INT DEFAULT 1,
    first_click TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_click TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    is_suspicious BOOLEAN DEFAULT FALSE,
    INDEX idx_ip_monitoring (ip_address),
    INDEX idx_last_click (last_click)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- جدول الإعلانات المخصصة
CREATE TABLE IF NOT EXISTS custom_ads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    link_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    position VARCHAR(50) DEFAULT 'banner',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active),
    INDEX idx_position (position)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- إدراج مشرف افتراضي (يمكنك تغيير كلمة المرور لاحقاً)
-- كلمة المرور: admin123
INSERT IGNORE INTO admins (username, email, password_hash, is_verified) VALUES 
('admin', 'admin@wajhne.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', TRUE);

-- إنشاء فهارس إضافية للأداء
CREATE INDEX IF NOT EXISTS idx_click_stats_country_time ON click_stats(country, timestamp);
CREATE INDEX IF NOT EXISTS idx_click_stats_ip_time ON click_stats(ip_address, timestamp);

-- إعدادات الأداء
SET GLOBAL innodb_buffer_pool_size = 128M;
SET GLOBAL query_cache_size = 16M;
SET GLOBAL query_cache_type = ON;

COMMIT;
