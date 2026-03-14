import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { generateId } from '@utils/uuid.util';

import { type OrderProps } from '../contracts/order-props.contract';
import { OrderStatus } from '../enums/order-status.enum';
import { OrderInvalidTransitionError } from '../errors/order-invalid-transition.error';
import { OrderReceivedEvent } from '../events/order-received.event';
import { OrderItem } from './order-item.entity';

export class Order extends AggregateRootBase {
  private readonly _requisitionId: string;
  private readonly _supplierId: string;
  private _status: OrderStatus;
  private readonly _items: OrderItem[];

  private constructor(props: OrderProps) {
    super(props.id, props.tenantId);
    this._requisitionId = props.requisitionId;
    this._supplierId = props.supplierId;
    this._status = props.status;
    this._items = props.items.map((i) => OrderItem.reconstitute(i));
  }

  static create(
    tenantId: string,
    requisitionId: string,
    supplierId: string,
    items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>,
  ): Order {
    const id = generateId();
    const orderItems = items.map((item) =>
      OrderItem.create(
        id,
        item.itemType,
        item.itemId,
        item.description,
        item.quantity,
        item.unitPrice,
      ),
    );

    return new Order({
      id,
      tenantId,
      requisitionId,
      supplierId,
      status: OrderStatus.PENDING,
      subtotal: orderItems.reduce((acc, i) => acc + i.lineTotal, 0),
      total: orderItems.reduce((acc, i) => acc + i.lineTotal, 0),
      items: orderItems.map((i) => i.toProps()),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: OrderProps): Order {
    return new Order(props);
  }

  get requisitionId(): string {
    return this._requisitionId;
  }

  get supplierId(): string {
    return this._supplierId;
  }

  get status(): OrderStatus {
    return this._status;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  get subtotal(): number {
    return Math.round(this._items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  }

  get total(): number {
    return this.subtotal;
  }

  receive(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new OrderInvalidTransitionError(this._status, OrderStatus.RECEIVED);
    }
    this._status = OrderStatus.RECEIVED;
    this.touch();
    this.apply(
      new OrderReceivedEvent(
        this._id,
        this._tenantId,
        this._supplierId,
        this.total,
        this._items.map((i) => ({
          itemType: i.itemType,
          itemId: i.itemId,
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
        })),
      ),
    );
  }

  cancel(): void {
    if (this._status !== OrderStatus.PENDING) {
      throw new OrderInvalidTransitionError(this._status, OrderStatus.CANCELLED);
    }
    this._status = OrderStatus.CANCELLED;
    this.touch();
  }
}
