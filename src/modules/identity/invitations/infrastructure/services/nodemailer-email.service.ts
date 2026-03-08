import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

import { type IEmailService } from '../../application/contracts/email-service.contract';

@Injectable()
export class NodemailerEmailService implements IEmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;
  private readonly appUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.from = this.configService.get<string>('email.from')!;
    this.appUrl = this.configService.get<string>('email.appUrl')!;

    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('email.host'),
      port: this.configService.get<number>('email.port'),
      auth: {
        user: this.configService.get<string>('email.user'),
        pass: this.configService.get<string>('email.pass'),
      },
    });
  }

  async sendInvitation(to: string, token: string): Promise<void> {
    const acceptUrl = `${this.appUrl}/api/invitations/${token}/accept`;

    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: 'You have been invited',
      text: [
        'You have been invited to join the platform.',
        '',
        'To accept the invitation and set up your account, visit the following link:',
        '',
        acceptUrl,
        '',
        'This invitation will expire in 7 days.',
        '',
        'If you did not expect this invitation, you can safely ignore this email.',
      ].join('\n'),
    });
  }
}
