
import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Import configuration and middleware
import { CONFIG } from './server/config/settings.js';
import { testConnection } from './server/config/database.js';
import { createRateLimiter, restrictToAllowedIPs } from './server/middleware/auth.js';

// Import routes
import statsRoutes from './server/routes/stats.js';
import uploadsRoutes from './server/routes/uploads.js';
import adminRoutes from './server/routes/admin.js';
import banRoutes from './server/routes/banManagement.js';
import { checkBanStatus, monitorClickRate } from './server/middleware/banCheck.js';
import antiClickBotRoutes from './server/routes/antiClickBot.js';
import { antiClickBotMiddleware, cleanupOldRecords } from './server/middleware/antiClickBot.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = CONFIG.PORT;

// Test database connection on startup
testConnection().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json());

// Add debugging middleware for anti-click-bot routes
app.use('/api/admin-4Bxr7Xt89/anti-click-bot', (req, res, next) => {
  console.log(`Anti-click-bot request: ${req.method} ${req.path}`);
  next();
});

// Rate limiter for sensitive endpoints
const limiter = createRateLimiter();
app.use('/api/admin-4Bxr7Xt89/login', limiter);
app.use('/api/admin-4Bxr7Xt89/register', limiter);
app.use('/api/admin-4Bxr7Xt89/verify-otp', limiter);

// Add anti-click-bot protection to click endpoint
app.use('/api/click', checkBanStatus, antiClickBotMiddleware, monitorClickRate);

// Static file serving - المسار المصحح للـ frontend
app.use(express.static(path.join(__dirname, '../')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api', statsRoutes);
app.use('/api', uploadsRoutes);

// Admin routes with IP restriction
app.use('/api/admin-4Bxr7Xt89', restrictToAllowedIPs, adminRoutes);
app.use('/api/admin-4Bxr7Xt89', restrictToAllowedIPs, banRoutes);
app.use('/api/admin-4Bxr7Xt89/anti-click-bot', restrictToAllowedIPs, antiClickBotRoutes);

// Test route to verify anti-click-bot is working
app.get('/api/admin-4Bxr7Xt89/anti-click-bot/test', (req, res) => {
  res.json({ success: true, message: 'Anti-click-bot routes are working!' });
});

// Serve React app for all other routes - المسار المصحح
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Start cleanup task every hour
setInterval(cleanupOldRecords, 60 * 60 * 1000);

// Start the server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
  console.log(`📊 Stats API: /api/stats`);
  console.log(`🔐 Admin Panel: /admin-4Bxr7Xt89-secure`);
  console.log(`📁 File uploads: /api/upload-image & /api/upload-sound`);
  console.log(`🛡️ Anti-Click-Bot: /api/admin-4Bxr7Xt89/anti-click-bot`);
});
