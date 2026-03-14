import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { DealApprovedIntegrationEvent } from '@core/application/events/deal-approved.integration-event';
import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@core/infrastructure/tokens/rabbitmq-channel.token';

import { RegisterMovementCommand } from '../../application/commands/register-movement/register-movement.command';
import { MovementSource } from '../../domain/enums/movement-source.enum';
import { MovementType } from '../../domain/enums/movement-type.enum';

@Injectable()
export class DealApprovedConsumer extends IntegrationEventConsumer<DealApprovedIntegrationEvent> {
  protected readonly queue = 'inventory.queue';
  protected readonly routingKey = 'deal.approved';

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
  }

  protected async handle(event: DealApprovedIntegrationEvent): Promise<void> {
    for (const item of event.items) {
      if (item.itemType !== LineItemType.PRODUCT) {
        continue;
      }
      const command = new RegisterMovementCommand(
        event.tenantId,
        item.itemId,
        null,
        null,
        MovementType.EXIT,
        item.quantity,
        MovementSource.SALE,
        event.dealId,
        null,
      );
      await this.commandBus.execute(command);
    }
  }
}
