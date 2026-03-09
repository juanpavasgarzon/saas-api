import { registerAs } from '@nestjs/config';

export const emailConfig = registerAs('email', () => ({
  host: process.env.SMTP_HOST!,
  port: parseInt(process.env.SMTP_PORT!, 10),
  user: process.env.SMTP_USER!,
  pass: process.env.SMTP_PASS!,
  secure: process.env.SMTP_SECURE === 'true',
  from: process.env.SMTP_FROM!,
}));
