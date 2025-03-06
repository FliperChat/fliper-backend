import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { ErrorLogService } from './modules/errorLog/errorLog.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter(app.get(ErrorLogService)));
  // app.enableCors({
  //   origin: ['http://localhost:5000', 'http://localhost:3000'],
  //   credentials: true,
  // });
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
