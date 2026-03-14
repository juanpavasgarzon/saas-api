import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type IOutboxMessageRepository } from '@core/application/contracts/outbox-repository.contract';
import { OrderReceivedIntegrationEvent } from '@core/application/events/order-received.integration-event';
import { OUTBOX_REPOSITORY } from '@core/application/tokens/outbox-repository.token';

import { OrderReceivedEvent } from '../../domain/events/order-received.event';

@EventsHandler(OrderReceivedEvent)
export class OrderReceivedEventHandler implements IEventHandler<OrderReceivedEvent> {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: IOutboxMessageRepository,
  ) {}

  async handle(event: OrderReceivedEvent): Promise<void> {
    const integrationEvent = new OrderReceivedIntegrationEvent(
      event.orderId,
      event.tenantId,
      event.supplierId,
      event.total,
      event.items,
    );
    await this.outbox.save(integrationEvent);
  }
}
