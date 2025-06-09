
import dotenv from 'dotenv';
dotenv.config();

export const productionConfig = {
  database: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'wajhne_db',
    charset: 'utf8mb4',
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true
  },
  email: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS
  },
  security: {
    adminSecret: process.env.ADMIN_REGISTER_SECRET || 'MySuperSecretKey2024'
  },
  server: {
    port: process.env.PORT || 3000,
    domain: 'https://wajhne.com'
  }
};
