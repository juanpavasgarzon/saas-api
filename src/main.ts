import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { GlobalHttpExceptionFilter } from './core/presentation/http-exception.filter';
import { setUpSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.getOrThrow<number>('app.port');
  const apiPrefix = config.getOrThrow<string>('app.apiPrefix');

  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(compression());
  app.setGlobalPrefix(apiPrefix);

  const validationPipe = new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: { enableImplicitConversion: true },
  });
  app.useGlobalPipes(validationPipe);

  const globalHttpExceptionFilter = new GlobalHttpExceptionFilter();
  app.useGlobalFilters(globalHttpExceptionFilter);

  setUpSwagger(app);

  app.enableCors();
  app.enableShutdownHooks();

  await app.listen(port);
}

bootstrap().catch((error) => {
  console.error('Error starting the application:', error);
  process.exit(1);
});
