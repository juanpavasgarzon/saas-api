import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { QuotationAcceptedIntegrationEvent } from '@shared/application/events/quotation-accepted.integration-event';

import { CreateSaleFromQuotationCommand } from '../commands/create-sale-from-quotation/create-sale-from-quotation.command';

@EventsHandler(QuotationAcceptedIntegrationEvent)
export class QuotationAcceptedIntegrationEventHandler implements IEventHandler<QuotationAcceptedIntegrationEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: QuotationAcceptedIntegrationEvent): Promise<void> {
    const createSaleCommand = new CreateSaleFromQuotationCommand(
      event.tenantId,
      event.quotationId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(createSaleCommand);
  }
}
