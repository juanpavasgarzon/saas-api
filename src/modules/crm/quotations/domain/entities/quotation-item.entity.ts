import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';
import { generateId } from '@shared/utils/uuid.util';

import { type QuotationItemProps } from '../contracts/quotation-item-props.contract';

export class QuotationItem {
  private readonly _id: string;
  private readonly _quotationId: string;
  private _description: string;
  private _quantity: number;
  private _unit: UnitOfMeasure;
  private _unitPrice: number;

  private constructor(props: QuotationItemProps) {
    this._id = props.id;
    this._quotationId = props.quotationId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unit = props.unit;
    this._unitPrice = props.unitPrice;
  }

  static create(
    quotationId: string,
    description: string,
    quantity: number,
    unit: UnitOfMeasure,
    unitPrice: number,
  ): QuotationItem {
    return new QuotationItem({
      id: generateId(),
      quotationId,
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
      description: this._description,
      quantity: this._quantity,
      unit: this._unit,
      unitPrice: this._unitPrice,
      lineTotal: this.lineTotal,
    };
  }
}
