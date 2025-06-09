
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Database configuration
export const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
};

// Create database connection pool
export const pool = mysql.createPool(dbConfig);

// Test database connection
export const testConnection = async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅ Database connected successfully');
    conn.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
};
