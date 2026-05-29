import 'dotenv/config'; // Must be first — loads .env into process.env before any module initializes
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*', credentials: true });

  // Middleware to capture shutdown state and return 503 for all health checks & requests
  let isShuttingDown = false;
  app.use((req: any, res: any, next: any) => {
    if (isShuttingDown) {
      res.setHeader('Connection', 'close');
      res.status(503).send('Service Unavailable: Server is shutting down');
      return;
    }
    next();
  });

  const server = app.getHttpServer();
  const activeConnections = new Set<any>();

  // Track active TCP connections so we can force close if drainage exceeds limit
  server.on('connection', (socket: any) => {
    activeConnections.add(socket);
    socket.on('close', () => {
      activeConnections.delete(socket);
    });
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NestJS Gateway active on port ${port}`);

  // Graceful shutdown function
  const handleShutdown = async (signal: string) => {
    console.log(`\n⚠️ Received ${signal}. Starting NestJS Graceful Shutdown (SIGTERM drainage)...`);
    
    // 1. Immediately trigger isShuttingDown flag to return 503 for new incoming requests
    isShuttingDown = true;
    console.log('🛑 Server health check state marked as 503 Service Unavailable');

    // 2. Stop routing/accepting any new TCP connections
    server.close((err: any) => {
      if (err) {
        console.error('Error closing HTTP server:', err);
      } else {
        console.log('🔒 HTTP server closed: no new connections will be accepted.');
      }
    });

    // 3. Keep track of active requests drainage timeout (up to 30 seconds)
    const drainTimeout = setTimeout(() => {
      console.warn('⚠️ Drainage timeout exceeded (30s). Forcefully terminating remaining active connections...');
      for (const socket of activeConnections) {
        socket.destroy();
      }
    }, 30000);

    // Helper to check if connections are drained
    const checkDrain = setInterval(async () => {
      if (activeConnections.size === 0) {
        clearInterval(checkDrain);
        clearTimeout(drainTimeout);
        console.log('✅ All active connections cleanly drained.');

        // 4. Close the NestJS app (triggers OnModuleDestroy, closing Prisma & Redlock Redis connections)
        console.log('🔌 Disconnecting database pools and socket connections...');
        await app.close();
        console.log('💤 NestJS Gateway shutdown complete. Exiting cleanly with code 0.');
        process.exit(0);
      } else {
        console.log(`⏳ Waiting for ${activeConnections.size} active connection(s) to drain...`);
      }
    }, 1000);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}
bootstrap();
