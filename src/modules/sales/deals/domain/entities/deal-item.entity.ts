import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';
import { generateId } from '@utils/uuid.util';

import { type DealItemProps } from '../contracts/deal-item-props.contract';

export class DealItem {
  private readonly _id: string;
  private readonly _dealId: string;
  private readonly _itemType: LineItemType;
  private readonly _itemId: string;
  private readonly _description: string;
  private readonly _quantity: number;
  private readonly _unit: UnitOfMeasure;
  private readonly _unitPrice: number;

  private constructor(props: DealItemProps) {
    this._id = props.id;
    this._dealId = props.dealId;
    this._itemType = props.itemType;
    this._itemId = props.itemId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unit = props.unit;
    this._unitPrice = props.unitPrice;
  }

  static create(
    dealId: string,
    itemType: LineItemType,
    itemId: string,
    description: string,
    quantity: number,
    unit: UnitOfMeasure,
    unitPrice: number,
  ): DealItem {
    return new DealItem({
      id: generateId(),
      dealId,
      itemType,
      itemId,
      description,
      quantity,
      unit,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    });
  }

  static reconstitute(props: DealItemProps): DealItem {
    return new DealItem(props);
  }

  get id(): string {
    return this._id;
  }
  get dealId(): string {
    return this._dealId;
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
  get unit(): UnitOfMeasure {
    return this._unit;
  }
  get unitPrice(): number {
    return this._unitPrice;
  }
  get lineTotal(): number {
    return Math.round(this._quantity * this._unitPrice * 100) / 100;
  }

  toProps(): DealItemProps {
    return {
      id: this._id,
      dealId: this._dealId,
      itemType: this._itemType,
      itemId: this._itemId,
      description: this._description,
      quantity: this._quantity,
      unit: this._unit,
      unitPrice: this._unitPrice,
      lineTotal: this.lineTotal,
    };
  }
}
