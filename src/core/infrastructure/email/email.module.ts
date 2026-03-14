import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EMAIL_SERVICE } from '../../application/tokens/email-service.token';
import { NodemailerEmailService } from './nodemailer-email.service';

@Module({
  imports: [ConfigModule],
  providers: [{ provide: EMAIL_SERVICE, useClass: NodemailerEmailService }],
  exports: [EMAIL_SERVICE],
})
export class EmailModule {}
