import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { generateId } from '@shared/utils/uuid.util';

import { type PurchaseOrderProps } from '../contracts/purchase-order-props.contract';
import { PurchaseOrderStatus } from '../enums/purchase-order-status.enum';
import { PurchaseOrderInvalidTransitionError } from '../errors/purchase-order-invalid-transition.error';
import { PurchaseOrderReceivedEvent } from '../events/purchase-order-received.event';
import { PurchaseOrderItem } from './purchase-order-item.entity';

export class PurchaseOrder extends AggregateRootBase {
  private readonly _purchaseRequestId: string;
  private readonly _vendorId: string;
  private _status: PurchaseOrderStatus;
  private readonly _items: PurchaseOrderItem[];

  private constructor(props: PurchaseOrderProps) {
    super(props.id, props.tenantId);
    this._purchaseRequestId = props.purchaseRequestId;
    this._vendorId = props.vendorId;
    this._status = props.status;
    this._items = props.items.map((i) => PurchaseOrderItem.reconstitute(i));
  }

  static create(
    tenantId: string,
    purchaseRequestId: string,
    vendorId: string,
    items: Array<{ description: string; quantity: number; unitPrice: number }>,
  ): PurchaseOrder {
    const id = generateId();
    const orderItems = items.map((item) =>
      PurchaseOrderItem.create(id, item.description, item.quantity, item.unitPrice),
    );

    return new PurchaseOrder({
      id,
      tenantId,
      purchaseRequestId,
      vendorId,
      status: PurchaseOrderStatus.PENDING,
      subtotal: orderItems.reduce((acc, i) => acc + i.lineTotal, 0),
      total: orderItems.reduce((acc, i) => acc + i.lineTotal, 0),
      items: orderItems.map((i) => i.toProps()),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: PurchaseOrderProps): PurchaseOrder {
    return new PurchaseOrder(props);
  }

  get purchaseRequestId(): string {
    return this._purchaseRequestId;
  }

  get vendorId(): string {
    return this._vendorId;
  }

  get status(): PurchaseOrderStatus {
    return this._status;
  }

  get items(): PurchaseOrderItem[] {
    return this._items;
  }

  get subtotal(): number {
    return Math.round(this._items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  }

  get total(): number {
    return this.subtotal;
  }

  receive(): void {
    if (this._status !== PurchaseOrderStatus.PENDING) {
      throw new PurchaseOrderInvalidTransitionError(this._status, PurchaseOrderStatus.RECEIVED);
    }
    this._status = PurchaseOrderStatus.RECEIVED;
    this.touch();
    this.apply(
      new PurchaseOrderReceivedEvent(
        this._id,
        this._tenantId,
        this._items.map((i) => ({
          productId: null,
          description: i.description,
          quantity: i.quantity,
        })),
      ),
    );
  }

  cancel(): void {
    if (this._status !== PurchaseOrderStatus.PENDING) {
      throw new PurchaseOrderInvalidTransitionError(this._status, PurchaseOrderStatus.CANCELLED);
    }
    this._status = PurchaseOrderStatus.CANCELLED;
    this.touch();
  }
}
