import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { generateId } from '@utils/uuid.util';

import { type RequisitionItemProps } from '../contracts/requisition-item-props.contract';

export class RequisitionItem {
  private readonly _id: string;
  private readonly _requisitionId: string;
  private readonly _itemType: LineItemType;
  private readonly _itemId: string;
  private readonly _description: string;
  private readonly _quantity: number;
  private readonly _unitPrice: number;
  private readonly _lineTotal: number;

  private constructor(props: RequisitionItemProps) {
    this._id = props.id;
    this._requisitionId = props.requisitionId;
    this._itemType = props.itemType;
    this._itemId = props.itemId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unitPrice = props.unitPrice;
    this._lineTotal = props.lineTotal;
  }

  static create(
    requisitionId: string,
    itemType: LineItemType,
    itemId: string,
    description: string,
    quantity: number,
    unitPrice: number,
  ): RequisitionItem {
    return new RequisitionItem({
      id: generateId(),
      requisitionId,
      itemType,
      itemId,
      description,
      quantity,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    });
  }

  static reconstitute(props: RequisitionItemProps): RequisitionItem {
    return new RequisitionItem(props);
  }

  get id(): string {
    return this._id;
  }

  get requisitionId(): string {
    return this._requisitionId;
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

  toProps(): RequisitionItemProps {
    return {
      id: this._id,
      requisitionId: this._requisitionId,
      itemType: this._itemType,
      itemId: this._itemId,
      description: this._description,
      quantity: this._quantity,
      unitPrice: this._unitPrice,
      lineTotal: this._lineTotal,
    };
  }
}
