import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { setupSwagger } from './setup.swagger';
import { SnakeToCamelPipe } from './global/snake-to-camel-pipe';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';

dotenv.config({
  path: path.resolve(
    process.env.NODE_ENV === 'development' ? 'env/.dev.env' : 'env/.prod.env',
  ),
});
async function bootstrap() {
  const port: number = parseInt(process.env.PORT);
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.useGlobalPipes(new SnakeToCamelPipe());

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  setupSwagger(app);
  await app.listen(port);
}
bootstrap();
