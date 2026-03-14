import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { generateId } from '@utils/uuid.util';

import { type OrderItemProps } from '../contracts/order-item-props.contract';

export class OrderItem {
  private readonly _id: string;
  private readonly _orderId: string;
  private readonly _itemType: LineItemType;
  private readonly _itemId: string;
  private readonly _description: string;
  private readonly _quantity: number;
  private readonly _unitPrice: number;
  private readonly _lineTotal: number;

  private constructor(props: OrderItemProps) {
    this._id = props.id;
    this._orderId = props.orderId;
    this._itemType = props.itemType;
    this._itemId = props.itemId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._lineTotal = props.lineTotal;
  }

  static create(
    orderId: string,
    itemType: LineItemType,
    itemId: string,
    description: string,
    quantity: number,
    unitPrice: number,
  ): OrderItem {
    return new OrderItem({
      id: generateId(),
      orderId,
      itemType,
      itemId,
      description,
      quantity,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    });
  }

  static reconstitute(props: OrderItemProps): OrderItem {
    return new OrderItem(props);
  }

  get id(): string {
    return this._id;
  }

  get orderId(): string {
    return this._orderId;
  }

  get itemType(): LineItemType {
    return this._itemType;
  }

  get itemId(): string {
    return this._itemId;
  }

  get description(): string {
    return this._description;
  }

  get quantity(): number {
    return this._quantity;
  }

  get unitPrice(): number {
    return this._unitPrice;
  }

  get lineTotal(): number {
    return this._lineTotal;
  }

  toProps(): OrderItemProps {
    return {
      id: this._id,
      orderId: this._orderId,
      itemType: this._itemType,
      itemId: this._itemId,
      description: this._description,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      lineTotal: this._lineTotal,
    };
  }
}
