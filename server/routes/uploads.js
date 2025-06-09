
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from '../config/database.js';
import { upload } from '../middleware/multer.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// API endpoint to upload images
router.post('/upload-image/:imageId', upload.single('image'), async (req, res) => {
  try {
    const { imageId } = req.params;
    const isPressedVariant = req.body.isPressedVariant === 'true';

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const imageIdNumber = parseInt(imageId);
    if (![1, 2].includes(imageIdNumber)) {
      return res.status(400).json({ success: false, message: 'Invalid image ID' });
    }

    const relativePath = path.relative(path.join(__dirname, '../../public'), req.file.path);
    const filePath = `/${relativePath.replace(/\\/g, '/')}`;

    const conn = await pool.getConnection();
    try {
      const query = isPressedVariant
        ? 'UPDATE image_stats SET pressed_image_path = ? WHERE image_id = ?'
        : 'UPDATE image_stats SET image_path = ? WHERE image_id = ?';

      await conn.execute(query, [filePath, imageIdNumber]);

      return res.json({
        success: true,
        message: `Image ${imageIdNumber}${isPressedVariant ? ' (pressed)' : ''} uploaded successfully`,
        filePath
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error in image upload:', error);
    res.status(500).json({ success: false, message: 'Error uploading image' });
  }
});

// API endpoint to upload sound files
router.post('/upload-sound/:imageId', upload.single('sound'), async (req, res) => {
  try {
    const { imageId } = req.params;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'لم يتم رفع أي ملف صوتي' });
    }

    const imageIdNumber = parseInt(imageId);
    if (![1, 2].includes(imageIdNumber)) {
      return res.status(400).json({ success: false, message: 'رقم الصورة غير صالح' });
    }

    const filename = req.file.filename;
    const filePath = `/uploads/sounds/${filename}`;
    
    const conn = await pool.getConnection();
    try {
      await conn.execute(
        'UPDATE image_stats SET sound_path = ? WHERE image_id = ?',
        [filePath, imageIdNumber]
      );

      return res.json({
        success: true,
        message: `تم رفع الصوت وربطه بالصورة رقم ${imageIdNumber} بنجاح`,
        filePath
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error in sound upload:', error);
    res.status(500).json({ success: false, message: 'خطأ أثناء رفع الصوت' });
  }
});

// API endpoint to get image data
router.get('/images', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [rows] = await conn.execute(
        'SELECT image_id, image_path, pressed_image_path, sound_path FROM image_stats'
      );

      const data = {
        image1: null,
        image2: null,
      };

      for (const row of rows) {
        const imageData = {
          default: row.image_path?.replace(/\\/g, '/'),
          pressed: row.pressed_image_path?.replace(/\\/g, '/'),
          sound: row.sound_path?.replace(/\\/g, '/'),
        };

        if (row.image_id === 1) {
          data.image1 = imageData;
        } else if (row.image_id === 2) {
          data.image2 = imageData;
        }
      }

      return res.json(data);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("Error fetching image paths:", error);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;