import { DealApprovedIntegrationEvent } from '../../application/events/deal-approved.integration-event';
import { OrderReceivedIntegrationEvent } from '../../application/events/order-received.integration-event';
import { QuotationAcceptedIntegrationEvent } from '../../application/events/quotation-accepted.integration-event';
import { QuotationExpiredIntegrationEvent } from '../../application/events/quotation-expired.integration-event';
import { QuotationRejectedIntegrationEvent } from '../../application/events/quotation-rejected.integration-event';

// One dedicated queue per consumer → no round-robin, no silent acks on wrong routing key.
export const QUEUE_BINDINGS: Record<string, string[]> = {
  // inventory consumers
  'inventory.quotation-accepted.queue': [QuotationAcceptedIntegrationEvent.eventName],
  'inventory.quotation-rejected.queue': [QuotationRejectedIntegrationEvent.eventName],
  'inventory.quotation-expired.queue': [QuotationExpiredIntegrationEvent.eventName],
  'inventory.deal-approved.queue': [DealApprovedIntegrationEvent.eventName],
  'inventory.order-received.queue': [OrderReceivedIntegrationEvent.eventName],
  // sales consumers
  'sales.quotation-accepted.queue': [QuotationAcceptedIntegrationEvent.eventName],
  'sales.deal-approved.queue': [DealApprovedIntegrationEvent.eventName],
  // procurement consumers
  'procurement.order-received.queue': [OrderReceivedIntegrationEvent.eventName],
};
