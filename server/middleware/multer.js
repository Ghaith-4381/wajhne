
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { UPLOAD_CONFIG } from '../config/settings.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// File storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = 'public/uploads/';
    
    // Determine folder based on file type
    if (file.mimetype.startsWith('image/')) {
      uploadPath += 'images/';
    } else if (file.mimetype.startsWith('audio/')) {
      uploadPath += 'sounds/';
    }
    
    // Create directory if it doesn't exist
    fs.mkdirSync(uploadPath, { recursive: true });
    
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    
    // Handle pressed variant naming for images
    const isPressedVariant = req.body.isPressedVariant === 'true';
    
    let fileName = file.fieldname + '-' + uniqueSuffix;
    if (isPressedVariant && file.mimetype.startsWith('image/')) {
      fileName += '-pressed';
    }
    
    cb(null, fileName + fileExt);
  }
});

// File filter with validation
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'image') {
    if (!UPLOAD_CONFIG.ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      return cb(new Error('نوع الصورة غير مدعوم! يرجى استخدام JPG, PNG, GIF, أو WEBP'));
    }
  } else if (file.fieldname === 'sound') {
    if (!UPLOAD_CONFIG.ALLOWED_AUDIO_TYPES.includes(file.mimetype)) {
      return cb(new Error('نوع الصوت غير مدعوم! يرجى استخدام MP3, WAV, أو OGG'));
    }
  }
  cb(null, true);
};

export const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: UPLOAD_CONFIG.MAX_FILE_SIZE
  }
});
