
const fs = require('fs');
const path = require('path');

console.log('🚀 Building for Vercel deployment...');

// Ensure dist directory exists
if (!fs.existsSync('dist')) {
  console.log('❌ dist directory not found. Please run npm run build first.');
  process.exit(1);
}

// Check for server.js in root
if (fs.existsSync('server.js')) {
  console.log('✅ server.js found in root');
} else {
  console.log('❌ server.js not found in root');
  process.exit(1);
}

// Check for server directory
if (fs.existsSync('server')) {
  console.log('✅ server directory found');
} else {
  console.log('❌ server directory not found');
  process.exit(1);
}

// Check for vercel.json
if (fs.existsSync('vercel.json')) {
  console.log('✅ vercel.json found');
} else {
  console.log('❌ vercel.json not found');
  process.exit(1);
}

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
let missingVars = [];
requiredEnvVars.forEach(envVar => {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.log(`⚠️  ${envVar} is not set`);
    missingVars.push(envVar);
  }
});

console.log('✅ Vercel build preparation completed!');
console.log('📝 Next steps:');
console.log('1. Make sure all environment variables are set in Vercel dashboard:');
if (missingVars.length > 0) {
  missingVars.forEach(envVar => {
    console.log(`   - ${envVar}`);
  });
}
console.log('2. Run: vercel --prod');
console.log('3. Test the admin route: https://your-domain.vercel.app/admin-4Bxr7Xt89-secure');
console.log('4. Check that API endpoints work: https://your-domain.vercel.app/api/health');
