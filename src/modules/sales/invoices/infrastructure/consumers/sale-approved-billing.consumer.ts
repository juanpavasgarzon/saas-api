import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { SaleApprovedIntegrationEvent } from '@shared/application/events/sale-approved.integration-event';
import { AbstractIntegrationEventConsumer } from '@shared/infrastructure/messaging/abstract-integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@shared/infrastructure/tokens/rabbitmq-channel.token';

import { CreateInvoiceFromSaleCommand } from '../../application/commands/create-invoice-from-sale/create-invoice-from-sale.command';

@Injectable()
export class SaleApprovedBillingConsumer extends AbstractIntegrationEventConsumer<SaleApprovedIntegrationEvent> {
  protected readonly queue = 'sales.queue';
  protected readonly routingKey = 'sale.approved';

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
  }

  protected async handle(event: SaleApprovedIntegrationEvent): Promise<void> {
    const command = new CreateInvoiceFromSaleCommand(
      event.tenantId,
      event.saleId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(command);
  }
}
