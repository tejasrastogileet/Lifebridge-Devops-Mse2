/**
 * Validate that all required environment variables are present at startup
 * Fails fast if any required var is missing
 */

function validateEnv() {
  const required = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error(`\n❌ FATAL: Missing required environment variables: ${missing.join(', ')}`);
    console.error('\nRequired vars:');
    console.error('  - MONGODB_URI: MongoDB connection string');
    console.error('  - JWT_SECRET: Secret for JWT signing (min 32 chars)');
    console.error('  - PORT: Port number for server\n');
    process.exit(1);
  }
  
  const optional = ['OPENCAGE_API_KEY', 'ORS_API_KEY', 'FRONTEND_URL'];
  const missingOptional = optional.filter(key => !process.env[key]);
  
  if (missingOptional.length > 0) {
    console.warn(`⚠️  Optional env vars not set: ${missingOptional.join(', ')}`);
  }
  
  console.log('✅ Environment validation passed');
}

module.exports = validateEnv;
