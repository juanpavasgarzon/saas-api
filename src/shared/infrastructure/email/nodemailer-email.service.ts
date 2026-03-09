import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

import { IEmailService, SendEmailInput } from '../../application/contracts/email-service.contract';

@Injectable()
export class NodemailerEmailService implements IEmailService, OnModuleInit {
  private readonly logger = new Logger(NodemailerEmailService.name);
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.from = this.configService.getOrThrow<string>('email.from');

    this.transporter = nodemailer.createTransport({
      host: this.configService.getOrThrow<string>('email.host'),
      port: this.configService.getOrThrow<number>('email.port'),
      secure: this.configService.getOrThrow<boolean>('email.secure'),
      auth: {
        user: this.configService.getOrThrow<string>('email.user'),
        pass: this.configService.getOrThrow<string>('email.pass'),
      },
    });
  }

  onModuleInit() {
    this.logger.log('EmailService initialized');
  }

  async sendMail(input: SendEmailInput): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to: input.to,
      subject: input.subject,
      text: input.text,
      attachments: input.attachments,
    });
  }
}
