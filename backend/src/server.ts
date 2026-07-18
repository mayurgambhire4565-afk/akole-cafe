// Trigger nodemon restart
import { env } from './config/env';
import app from './app';
import prisma from './database/prisma';

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ Database connected successfully');

    app.listen(env.PORT, () => {
      console.log(`\n☕ Coffee Katta API running`);
      console.log(`   → Local:   http://localhost:${env.PORT}`);
      console.log(`   → Health:  http://localhost:${env.PORT}/api/health`);
      console.log(`   → Mode:    ${env.NODE_ENV}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Gracefully shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

startServer();
