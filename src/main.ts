import { NestFactory } from '@nestjs/core';
import { AppModule } from './API/Modules/AppModule';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(5000);
  console.log(Math.random() + 'test');
}
bootstrap();
