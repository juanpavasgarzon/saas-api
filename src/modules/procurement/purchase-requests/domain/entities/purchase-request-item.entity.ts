import { generateId } from '@shared/utils/uuid.util';

import { type PurchaseRequestItemProps } from '../contracts/purchase-request-item-props.contract';

export class PurchaseRequestItem {
  private readonly _id: string;
  private readonly _purchaseRequestId: string;
  private readonly _description: string;
  private readonly _quantity: number;
  private readonly _unitPrice: number;
  private readonly _lineTotal: number;

  private constructor(props: PurchaseRequestItemProps) {
    this._id = props.id;
    this._purchaseRequestId = props.purchaseRequestId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._lineTotal = props.lineTotal;
  }

  static create(
    purchaseRequestId: string,
    description: string,
    quantity: number,
    unitPrice: number,
  ): PurchaseRequestItem {
    return new PurchaseRequestItem({
      id: generateId(),
      purchaseRequestId,
      description,
      quantity,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    });
  }

  static reconstitute(props: PurchaseRequestItemProps): PurchaseRequestItem {
    return new PurchaseRequestItem(props);
  }

  get id(): string {
    return this._id;
  }

  get purchaseRequestId(): string {
    return this._purchaseRequestId;
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

  toProps(): PurchaseRequestItemProps {
    return {
      id: this._id,
      purchaseRequestId: this._purchaseRequestId,
      description: this._description,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      lineTotal: this._lineTotal,
    };
  }
}
