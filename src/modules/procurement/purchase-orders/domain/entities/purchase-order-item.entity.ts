import { generateId } from '@shared/utils/uuid.util';

import { type PurchaseOrderItemProps } from '../contracts/purchase-order-item-props.contract';

export class PurchaseOrderItem {
  private readonly _id: string;
  private readonly _purchaseOrderId: string;
  private readonly _description: string;
  private readonly _quantity: number;
  private readonly _unitPrice: number;
  private readonly _lineTotal: number;

  private constructor(props: PurchaseOrderItemProps) {
    this._id = props.id;
    this._purchaseOrderId = props.purchaseOrderId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._lineTotal = props.lineTotal;
  }

  static create(
    purchaseOrderId: string,
    description: string,
    quantity: number,
    unitPrice: number,
  ): PurchaseOrderItem {
    return new PurchaseOrderItem({
      id: generateId(),
      purchaseOrderId,
      description,
      quantity,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    });
  }

  static reconstitute(props: PurchaseOrderItemProps): PurchaseOrderItem {
    return new PurchaseOrderItem(props);
  }

  get id(): string {
    return this._id;
  }

  get purchaseOrderId(): string {
    return this._purchaseOrderId;
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

  toProps(): PurchaseOrderItemProps {
    return {
      id: this._id,
      purchaseOrderId: this._purchaseOrderId,
      description: this._description,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      lineTotal: this._lineTotal,
    };
  }
}
