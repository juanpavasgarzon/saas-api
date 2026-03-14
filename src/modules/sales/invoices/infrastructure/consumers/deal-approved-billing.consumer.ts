import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { DealApprovedIntegrationEvent } from '@core/application/events/deal-approved.integration-event';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@core/infrastructure/tokens/rabbitmq-channel.token';

import { CreateInvoiceFromSaleCommand } from '../../application/commands/create-invoice-from-sale/create-invoice-from-sale.command';

@Injectable()
export class DealApprovedBillingConsumer extends IntegrationEventConsumer<DealApprovedIntegrationEvent> {
  protected readonly queue = 'sales.queue';
  protected readonly routingKey = 'deal.approved';

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
  }

  protected async handle(event: DealApprovedIntegrationEvent): Promise<void> {
    const command = new CreateInvoiceFromSaleCommand(
      event.tenantId,
      event.dealId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(command);
  }
}
