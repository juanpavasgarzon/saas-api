import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type ICreatePurchaseOrderService } from '@modules/procurement/shared/contracts/create-purchase-order.contract';
import { type IProspectToVendorService } from '@modules/procurement/shared/contracts/prospect-to-vendor.contract';
import { CREATE_PURCHASE_ORDER_SERVICE } from '@modules/procurement/shared/tokens/create-purchase-order.token';
import { PROSPECT_TO_VENDOR_SERVICE } from '@modules/procurement/shared/tokens/prospect-to-vendor.token';

import { PurchaseRequestApprovedEvent } from '../../domain/events/purchase-request-approved.event';

@EventsHandler(PurchaseRequestApprovedEvent)
export class PurchaseRequestApprovedEventHandler implements IEventHandler<PurchaseRequestApprovedEvent> {
  constructor(
    @Inject(PROSPECT_TO_VENDOR_SERVICE)
    private readonly prospectToVendor: IProspectToVendorService,
    @Inject(CREATE_PURCHASE_ORDER_SERVICE)
    private readonly createPurchaseOrder: ICreatePurchaseOrderService,
  ) {}

  async handle(event: PurchaseRequestApprovedEvent): Promise<void> {
    let vendorId = event.vendorId ?? '';

    if (event.vendorProspectId) {
      const convertedVendorId = await this.prospectToVendor.convert(
        event.vendorProspectId,
        event.tenantId,
      );
      if (convertedVendorId) {
        vendorId = convertedVendorId;
      }
    }

    if (!vendorId) {
      return;
    }

    await this.createPurchaseOrder.createFromRequest(
      event.tenantId,
      event.purchaseRequestId,
      vendorId,
      event.items,
    );
  }
}
