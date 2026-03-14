import { DealApprovedIntegrationEvent } from '../../application/events/deal-approved.integration-event';
import { OrderReceivedIntegrationEvent } from '../../application/events/order-received.integration-event';
import { QuotationAcceptedIntegrationEvent } from '../../application/events/quotation-accepted.integration-event';
import { QuotationExpiredIntegrationEvent } from '../../application/events/quotation-expired.integration-event';
import { QuotationRejectedIntegrationEvent } from '../../application/events/quotation-rejected.integration-event';

export const QUEUE_BINDINGS: Record<string, string[]> = {
  'sales.queue': [
    QuotationAcceptedIntegrationEvent.eventName,
    DealApprovedIntegrationEvent.eventName,
  ],
  'inventory.queue': [
    QuotationAcceptedIntegrationEvent.eventName,
    QuotationRejectedIntegrationEvent.eventName,
    QuotationExpiredIntegrationEvent.eventName,
    DealApprovedIntegrationEvent.eventName,
    OrderReceivedIntegrationEvent.eventName,
  ],
  'crm.queue': [],
  'procurement.queue': [OrderReceivedIntegrationEvent.eventName],
};
