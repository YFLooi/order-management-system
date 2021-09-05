import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import Database from '@src/database';

async function bootstrap() {
  // Sets up connection to mongodb Atlas
  Database.init();

  const app = await NestFactory.create(AppModule, { cors: true });
  await app.listen(3200);
}
bootstrap();
