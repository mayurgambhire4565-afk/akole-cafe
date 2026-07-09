import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

export const env = {
  PORT: parseInt(process.env.PORT || '3001', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  EMAIL_HOST: process.env.EMAIL_HOST || 'smtp.gmail.com',
  EMAIL_PORT: parseInt(process.env.EMAIL_PORT || '587', 10),
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  EMAIL_FROM: process.env.EMAIL_FROM || 'Akole Cafe <noreply@akolecafe.com>',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'cookie_secret_dev',
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10),
  RATE_LIMIT_MAX: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
};
