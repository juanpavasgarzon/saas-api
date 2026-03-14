import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  // Application
  NODE_ENV: Joi.string().valid('development', 'production', 'test').required(),
  APP_PORT: Joi.number().integer().positive().required(),
  API_PREFIX: Joi.string().required(),

  // Database
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().integer().positive().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.string().valid('true', 'false').required(),
  DB_RUN_MIGRATIONS: Joi.string().valid('true', 'false').required(),

  // JWT
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_EXPIRES_IN: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),

  // Email (SMTP)
  SMTP_HOST: Joi.string().required(),
  SMTP_PORT: Joi.number().integer().positive().required(),
  SMTP_USER: Joi.string().required(),
  SMTP_PASS: Joi.string().required(),
  SMTP_SECURE: Joi.string().valid('true', 'false').required(),
  SMTP_FROM: Joi.string().required(),

  // RabbitMQ
  RABBITMQ_URL: Joi.string().uri().optional().default('amqp://guest:guest@localhost:5672'),
});
