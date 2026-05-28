import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Automatically validates all incoming request bodies
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Sends clean, consistent error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log('Server running on http://localhost:3000/api');
}
bootstrap();