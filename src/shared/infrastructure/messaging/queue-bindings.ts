import { PurchaseOrderReceivedIntegrationEvent } from '../../application/events/purchase-order-received.integration-event';
import { QuotationAcceptedIntegrationEvent } from '../../application/events/quotation-accepted.integration-event';
import { SaleApprovedIntegrationEvent } from '../../application/events/sale-approved.integration-event';

export const QUEUE_BINDINGS: Record<string, string[]> = {
  'sales.queue': [
    QuotationAcceptedIntegrationEvent.eventName,
    SaleApprovedIntegrationEvent.eventName,
  ],
  'inventory.queue': [
    SaleApprovedIntegrationEvent.eventName,
    PurchaseOrderReceivedIntegrationEvent.eventName,
  ],
  'crm.queue': [],
  'procurement.queue': [],
};
