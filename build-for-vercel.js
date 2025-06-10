const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Vercel deployment...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  console.log('❌ dist directory not found. Please run npm run build first.');
  process.exit(1);
}

// Copy server files to root if needed
const serverFiles = ['server.js', 'server'];
serverFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} found`);
  } else {
    console.log(`⚠️  ${file} not found`);
  }
});

// Check for required environment variables
const requiredEnvVars = [
  'DB_HOST',
  'DB_USER', 
  'DB_PASS',
  'DB_NAME',
  'EMAIL_USER',
  'EMAIL_PASS'
];

console.log('🔍 Checking environment variables...');
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.log(`⚠️  ${envVar} is not set`);
  }
});

console.log('✅ Vercel build preparation completed!');
console.log('📝 Next steps:');
console.log('1. Make sure all environment variables are set in Vercel dashboard');
console.log('2. Deploy using: vercel --prod');
console.log('3. Check that your domain is properly configured');
