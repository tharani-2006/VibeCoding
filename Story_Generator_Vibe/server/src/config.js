import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server
  PORT: process.env.PORT || 3001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Supabase
  SUPABASE_URL: process.env.SUPABASE_URL,
  SUPABASE_SERVICE_KEY: process.env.SUPABASE_SERVICE_KEY,
  
  // Gemini AI
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  
  // CORS
  CORS_ORIGINS: process.env.NODE_ENV === 'production'
    ? process.env.CORS_ORIGINS?.split(',') || []
    : ['http://localhost:5173', 'http://localhost:3000']
};

// Validate required environment variables
const requiredVars = ['SUPABASE_URL', 'SUPABASE_SERVICE_KEY', 'GEMINI_API_KEY'];

for (const varName of requiredVars) {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
}