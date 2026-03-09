import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { QuotationAcceptedIntegrationEvent } from '@shared/application/events/quotation-accepted.integration-event';
import { AbstractIntegrationEventConsumer } from '@shared/infrastructure/messaging/abstract-integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@shared/infrastructure/tokens/rabbitmq-channel.token';

import { CreateSaleFromQuotationCommand } from '../../application/commands/create-sale-from-quotation/create-sale-from-quotation.command';

@Injectable()
export class QuotationAcceptedConsumer extends AbstractIntegrationEventConsumer<QuotationAcceptedIntegrationEvent> {
  protected readonly queue = 'sales.queue';
  protected readonly routingKey = 'quotation.accepted';

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
  }

  protected async handle(event: QuotationAcceptedIntegrationEvent): Promise<void> {
    const command = new CreateSaleFromQuotationCommand(
      event.tenantId,
      event.quotationId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(command);
  }
}
