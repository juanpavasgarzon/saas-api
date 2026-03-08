import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';
import { generateId } from '@shared/utils/uuid.util';

import { type SaleItemProps } from '../contracts/sale-item-props.contract';

export class SaleItem {
  private readonly _id: string;
  private readonly _saleId: string;
  private readonly _description: string;
  private readonly _quantity: number;
  private readonly _unit: UnitOfMeasure;
  private readonly _unitPrice: number;

  private constructor(props: SaleItemProps) {
    this._id = props.id;
    this._saleId = props.saleId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unit = props.unit;
    this._unitPrice = props.unitPrice;
  }

  static create(
    saleId: string,
    description: string,
    quantity: number,
    unit: UnitOfMeasure,
    unitPrice: number,
  ): SaleItem {
    return new SaleItem({
      id: generateId(),
      saleId,
      description,
      quantity,
      unit,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    });
  }

  static reconstitute(props: SaleItemProps): SaleItem {
    return new SaleItem(props);
  }

  get id(): string {
    return this._id;
  }
  get saleId(): string {
    return this._saleId;
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

  toProps(): SaleItemProps {
    return {
      id: this._id,
      saleId: this._saleId,
      description: this._description,
      quantity: this._quantity,
      unit: this._unit,
      unitPrice: this._unitPrice,
      lineTotal: this.lineTotal,
    };
  }
}
