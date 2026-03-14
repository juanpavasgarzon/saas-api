import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { QuotationAcceptedIntegrationEvent } from '@core/application/events/quotation-accepted.integration-event';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@core/infrastructure/tokens/rabbitmq-channel.token';

import { CreateDealFromQuotationCommand } from '../../application/commands/create-deal-from-quotation/create-deal-from-quotation.command';

@Injectable()
export class QuotationAcceptedConsumer extends IntegrationEventConsumer<QuotationAcceptedIntegrationEvent> {
  protected readonly queue = 'sales.queue';
  protected readonly routingKey = 'quotation.accepted';

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
  }

  protected async handle(event: QuotationAcceptedIntegrationEvent): Promise<void> {
    const command = new CreateDealFromQuotationCommand(
      event.tenantId,
      event.quotationId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(command);
  }
}
