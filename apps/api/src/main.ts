import 'dotenv/config'; // Must be first — loads .env into process.env before any module initializes
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: '*', credentials: true });
  
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 NestJS Gateway active on port ${port}`);
}
bootstrap();
