import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => ({
  port: parseInt(process.env.APP_PORT!, 10),
  nodeEnv: process.env.NODE_ENV,
  apiPrefix: process.env.API_PREFIX,
}));
