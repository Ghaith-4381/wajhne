
import express from 'express';
import { pool } from '../config/database.js';

const router = express.Router();

// API endpoint to register a click
router.post('/click', async (req, res) => {
  try {
    const { imageId, country } = req.body;
    
    if (![1, 2].includes(imageId) || !country) {
      return res.status(400).json({ error: 'Invalid data' });
    }
    
    const conn = await pool.getConnection();
    
    try {
      await conn.beginTransaction();
      
      // Update total clicks for the image
      await conn.execute(
        'UPDATE image_stats SET total_clicks = total_clicks + 1 WHERE image_id = ?',
        [imageId]
      );
      
      // Update country-specific clicks for the image
      await conn.execute(
        `INSERT INTO country_stats (image_id, country, clicks) 
         VALUES (?, ?, 1) 
         ON DUPLICATE KEY UPDATE clicks = clicks + 1`,
        [imageId, country]
      );
      
      // Get the updated total clicks
      const [rows] = await conn.execute(
        'SELECT total_clicks FROM image_stats WHERE image_id = ?',
        [imageId]
      );
      
      await conn.commit();
      
      return res.json({ totalClicks: rows[0].total_clicks });
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error in click endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// API endpoint to get statistics
router.get('/stats', async (req, res) => {
  try {
    const conn = await pool.getConnection();
    
    try {
      const [totalStatsRows] = await conn.execute('SELECT * FROM image_stats');
      const [countryStatsRows] = await conn.execute('SELECT * FROM country_stats');
      
      const result = {
        image1: { total: 0, countries: {} },
        image2: { total: 0, countries: {} }
      };
      
      // Add total clicks
      for (const row of totalStatsRows) {
        if (row.image_id === 1) {
          result.image1.total = Number(row.total_clicks);
        } else if (row.image_id === 2) {
          result.image2.total = Number(row.total_clicks);
        }
      }
      
      // Add country statistics
      for (const row of countryStatsRows) {
        if (row.image_id === 1) {
          result.image1.countries[row.country] = Number(row.clicks);
        } else if (row.image_id === 2) {
          result.image2.countries[row.country] = Number(row.clicks);
        }
      }
      
      return res.json(result);
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Error in stats endpoint:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
