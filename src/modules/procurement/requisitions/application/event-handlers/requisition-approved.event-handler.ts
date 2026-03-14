import { Inject } from '@nestjs/common';
import { EventsHandler, type IEventHandler } from '@nestjs/cqrs';

import { type IOrderRepository } from '@modules/procurement/orders/domain/contracts/order-repository.contract';
import { Order } from '@modules/procurement/orders/domain/entities/order.entity';
import { ORDER_REPOSITORY } from '@modules/procurement/orders/domain/tokens/order-repository.token';
import { type IProspectRepository } from '@modules/procurement/prospects/domain/contracts/prospect-repository.contract';
import { SupplierProspectStatus } from '@modules/procurement/prospects/domain/enums/prospect-status.enum';
import { PROSPECT_REPOSITORY } from '@modules/procurement/prospects/domain/tokens/prospect-repository.token';
import { type ISupplierRepository } from '@modules/procurement/suppliers/domain/contracts/supplier-repository.contract';
import { Supplier } from '@modules/procurement/suppliers/domain/entities/supplier.entity';
import { SUPPLIER_REPOSITORY } from '@modules/procurement/suppliers/domain/tokens/supplier-repository.token';

import { RequisitionApprovedEvent } from '../../domain/events/requisition-approved.event';

@EventsHandler(RequisitionApprovedEvent)
export class RequisitionApprovedEventHandler implements IEventHandler<RequisitionApprovedEvent> {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
    @Inject(SUPPLIER_REPOSITORY)
    private readonly supplierRepository: ISupplierRepository,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async handle(event: RequisitionApprovedEvent): Promise<void> {
    let supplierId = event.supplierId ?? '';

    if (event.supplierProspectId) {
      const prospect = await this.prospectRepository.findById(
        event.supplierProspectId,
        event.tenantId,
      );
      let convertedSupplierId = '';
      if (prospect) {
        const email =
          prospect.email ?? `${prospect.name.toLowerCase().replace(/\s+/g, '.')}@unknown.com`;
        const existing = await this.supplierRepository.findByEmail(email, event.tenantId);
        if (existing) {
          prospect.updateStatus(SupplierProspectStatus.CONVERTED);
          await this.prospectRepository.save(prospect);
          convertedSupplierId = existing.id;
        } else {
          const supplier = Supplier.create(
            event.tenantId,
            prospect.name,
            email,
            prospect.phone ?? '',
            prospect.identificationNumber ?? '',
            prospect.address ?? '',
            prospect.company ?? null,
            prospect.contactPerson ?? null,
          );
          await this.supplierRepository.save(supplier);
          prospect.updateStatus(SupplierProspectStatus.CONVERTED);
          await this.prospectRepository.save(prospect);
          convertedSupplierId = supplier.id;
        }
      }
      if (convertedSupplierId) {
        supplierId = convertedSupplierId;
      }
    }

    if (!supplierId) {
      return;
    }

    const order = Order.create(event.tenantId, event.requisitionId, supplierId, event.items);
    await this.orderRepository.save(order);
  }
}
