import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';
import { generateId } from '@utils/uuid.util';

import { type QuotationItemProps } from '../contracts/quotation-item-props.contract';

export class QuotationItem {
  private readonly _id: string;
  private readonly _quotationId: string;
  private _itemType: LineItemType;
  private _itemId: string;
  private _description: string;
  private _quantity: number;
  private _unit: UnitOfMeasure;
  private _unitPrice: number;

  private constructor(props: QuotationItemProps) {
    this._id = props.id;
    this._quotationId = props.quotationId;
    this._itemType = props.itemType;
    this._itemId = props.itemId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unit = props.unit;
    this._unitPrice = props.unitPrice;
  }

  static create(
    quotationId: string,
    itemType: LineItemType,
    itemId: string,
    description: string,
    quantity: number,
    unit: UnitOfMeasure,
    unitPrice: number,
  ): QuotationItem {
    return new QuotationItem({
      id: generateId(),
      quotationId,
      itemType,
      itemId,
      description,
      quantity,
      unit,
      unitPrice,
      lineTotal: quantity * unitPrice,
    });
  }

  static reconstitute(props: QuotationItemProps): QuotationItem {
    return new QuotationItem(props);
  }

  get id(): string {
    return this._id;
  }

  get quotationId(): string {
    return this._quotationId;
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

  toProps(): QuotationItemProps {
    return {
      id: this._id,
      quotationId: this._quotationId,
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
