import { registerAs } from '@nestjs/config';

export const rabbitmqConfig = registerAs('rabbitmq', () => ({
  url: process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
  exchange: 'integration.events',
  queues: {
    crm: 'crm.queue',
    sales: 'sales.queue',
    billing: 'billing.queue',
    inventory: 'inventory.queue',
    procurement: 'procurement.queue',
  },
}));
