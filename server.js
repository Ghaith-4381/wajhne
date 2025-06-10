
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const adminRoutes = require('./server/routes/admin.js');
const statsRoutes = require('./server/routes/stats.js');
const uploadsRoutes = require('./server/routes/uploads.js');
const adsRoutes = require('./server/routes/ads.js');
const antiClickBotRoutes = require('./server/routes/antiClickBot.js');
const banManagementRoutes = require('./server/routes/banManagement.js');

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://waghne-ghaith-almohammads-projects.vercel.app', 'https://your-custom-domain.com'] 
    : ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/sounds', express.static(path.join(__dirname, 'public/sounds')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API Routes
app.use('/api/admin-4Bxr7Xt89', adminRoutes);
app.use('/api', statsRoutes);
app.use('/api', uploadsRoutes);
app.use('/api', adsRoutes);
app.use('/api', antiClickBotRoutes);
app.use('/api', banManagementRoutes);

// Handle React Router (catch-all handler)
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: 'Not Found', 
      message: 'The requested resource was not found.' 
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

const PORT = process.env.PORT || 3000;

// For Vercel, we export the app
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}
