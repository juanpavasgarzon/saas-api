import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type ChannelWrapper } from 'amqp-connection-manager';

import { SaleApprovedIntegrationEvent } from '@shared/application/events/sale-approved.integration-event';
import { AbstractIntegrationEventConsumer } from '@shared/infrastructure/messaging/abstract-integration-event-consumer';
import { RABBITMQ_CHANNEL } from '@shared/infrastructure/tokens/rabbitmq-channel.token';

import { RegisterMovementCommand } from '../../application/commands/register-movement/register-movement.command';
import { MovementSource } from '../../domain/enums/movement-source.enum';
import { MovementType } from '../../domain/enums/movement-type.enum';

@Injectable()
export class SaleApprovedConsumer extends AbstractIntegrationEventConsumer<SaleApprovedIntegrationEvent> {
  protected readonly queue = 'inventory.queue';
  protected readonly routingKey = 'sale.approved';

  constructor(
    @Inject(RABBITMQ_CHANNEL) channel: ChannelWrapper,
    private readonly commandBus: CommandBus,
  ) {
    super(channel);
  }

  protected async handle(event: SaleApprovedIntegrationEvent): Promise<void> {
    for (const item of event.items) {
      if (!item.productId) {
        continue;
      }
      const command = new RegisterMovementCommand(
        event.tenantId,
        item.productId,
        null,
        null,
        MovementType.EXIT,
        item.quantity,
        MovementSource.SALE,
        event.saleId,
        null,
      );
      await this.commandBus.execute(command);
    }
  }
}
