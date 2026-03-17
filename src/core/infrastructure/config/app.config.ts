import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: 3000,
  nodeEnv: process.env.NODE_ENV,
  apiPrefix: process.env.API_PREFIX,
}));
