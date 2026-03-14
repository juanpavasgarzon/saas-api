import { CommandBus, EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { QuotationAcceptedIntegrationEvent } from '@core/application/events/quotation-accepted.integration-event';

import { CreateDealFromQuotationCommand } from '../commands/create-deal-from-quotation/create-deal-from-quotation.command';

@EventsHandler(QuotationAcceptedIntegrationEvent)
export class QuotationAcceptedIntegrationEventHandler implements IEventHandler<QuotationAcceptedIntegrationEvent> {
  constructor(private readonly commandBus: CommandBus) {}

  async handle(event: QuotationAcceptedIntegrationEvent): Promise<void> {
    const createSaleCommand = new CreateDealFromQuotationCommand(
      event.tenantId,
      event.quotationId,
      event.customerId,
      event.items,
    );
    await this.commandBus.execute(createSaleCommand);
  }
}
