import { Inject, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { type AmqpConnectionManager } from 'amqp-connection-manager';

import { type IInboxMessageRepository } from '@core/application/contracts/inbox-repository.contract';
import { OrderReceivedIntegrationEvent } from '@core/application/events/order-received.integration-event';
import { INBOX_REPOSITORY } from '@core/application/tokens/inbox-repository.token';
import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { IntegrationEventConsumer } from '@core/infrastructure/messaging/integration-event-consumer';
import { RABBITMQ_CONNECTION } from '@core/infrastructure/tokens/rabbitmq-connection.token';

import { RegisterMovementCommand } from '../../application/commands/register-movement/register-movement.command';
import { MovementSource } from '../../domain/enums/movement-source.enum';
import { MovementType } from '../../domain/enums/movement-type.enum';

@Injectable()
export class OrderReceivedConsumer extends IntegrationEventConsumer<OrderReceivedIntegrationEvent> {
  protected readonly queue = 'inventory.order-received.queue';
  protected readonly routingKey = OrderReceivedIntegrationEvent.eventName;

  constructor(
    @Inject(RABBITMQ_CONNECTION) connection: AmqpConnectionManager,
    @Inject(INBOX_REPOSITORY) inboxRepo: IInboxMessageRepository,
    private readonly commandBus: CommandBus,
  ) {
    super(connection, inboxRepo);
  }

  protected async handle(event: OrderReceivedIntegrationEvent): Promise<void> {
    for (const item of event.items) {
      if (item.itemType !== LineItemType.PRODUCT) {
        continue;
      }
      const command = new RegisterMovementCommand(
        event.tenantId,
        item.itemId,
        null,
        null,
        MovementType.ENTRY,
        item.quantity,
        MovementSource.PURCHASE,
        event.orderId,
        'Auto: purchase order received',
      );
      await this.commandBus.execute(command);
    }
  }
}
