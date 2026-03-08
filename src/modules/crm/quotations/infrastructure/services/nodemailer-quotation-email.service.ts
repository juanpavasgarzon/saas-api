import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer from 'nodemailer';

import { type IQuotationEmailService } from '../../application/contracts/quotation-email-service.contract';

@Injectable()
export class NodemailerQuotationEmailService implements IQuotationEmailService {
  private readonly transporter: nodemailer.Transporter;
  private readonly from: string;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get<string>('email.host'),
      port: configService.get<number>('email.port'),
      auth: {
        user: configService.get<string>('email.user'),
        pass: configService.get<string>('email.pass'),
      },
    });
    this.from = configService.get<string>('email.from')!;
  }

  async sendWithPdf(
    to: string,
    quotationNumber: string,
    pdfBuffer: Buffer,
    filename: string,
  ): Promise<void> {
    await this.transporter.sendMail({
      from: this.from,
      to,
      subject: `Quotation ${quotationNumber}`,
      text: `Please find attached quotation ${quotationNumber} for your review. Feel free to contact us if you have any questions.`,
      attachments: [
        {
          filename,
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });
  }
}
