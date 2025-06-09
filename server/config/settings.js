
// Server configuration and constants
export const CONFIG = {
  PORT: 5000,
  // تم إزالة قيود IP للسماح لجميع عناوين IP بالوصول
  ALLOWED_IPS: ['127.0.0.1', '::1', '0.0.0.0'], // سماح لجميع عناوين IP
  
  // Rate limiting settings
  RATE_LIMIT: {
    WINDOW_MS: 15 * 60 * 1000, // 15 minutes
    MAX_REQUESTS: 100, // requests per window
  },
  
  // OTP settings
  OTP: {
    LENGTH: 6,
    EXPIRY_MINUTES: 10,
  },
  
  // Password settings
  PASSWORD: {
    SALT_ROUNDS: 10,
    MIN_LENGTH: 6,
  },
};

// File upload settings
export const UPLOAD_CONFIG = {
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_AUDIO_TYPES: ['audio/mpeg', 'audio/wav', 'audio/ogg'],
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  UPLOAD_PATHS: {
    IMAGES: 'public/uploads/images/',
    SOUNDS: 'public/uploads/sounds/',
  },
};
