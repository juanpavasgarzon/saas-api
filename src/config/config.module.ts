import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { appConfig } from './app.config';
import { configValidationSchema } from './config.validation';
import { databaseConfig } from './database.config';
import { emailConfig } from './email.config';
import { jwtConfig } from './jwt.config';
import { rabbitmqConfig } from './rabbitmq.config';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig, jwtConfig, emailConfig, rabbitmqConfig],
      validationSchema: configValidationSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),
  ],
})
export class ConfigModule {}
