import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';
import { generateId } from '@shared/utils/uuid.util';

import { type InvoiceItemProps } from '../contracts/invoice-item-props.contract';

export class InvoiceItem {
  private readonly _id: string;
  private readonly _invoiceId: string;
  private readonly _description: string;
  private readonly _quantity: number;
  private readonly _unit: UnitOfMeasure;
  private readonly _unitPrice: number;

  private constructor(props: InvoiceItemProps) {
    this._id = props.id;
    this._invoiceId = props.invoiceId;
    this._description = props.description;
    this._quantity = props.quantity;
    this._unit = props.unit;
    this._unitPrice = props.unitPrice;
  }

  static create(
    invoiceId: string,
    description: string,
    quantity: number,
    unit: UnitOfMeasure,
    unitPrice: number,
  ): InvoiceItem {
    return new InvoiceItem({
      id: generateId(),
      invoiceId,
      description,
      quantity,
      unit,
      unitPrice,
      lineTotal: Math.round(quantity * unitPrice * 100) / 100,
    });
  }

  static reconstitute(props: InvoiceItemProps): InvoiceItem {
    return new InvoiceItem(props);
  }

  get id(): string {
    return this._id;
  }
  get invoiceId(): string {
    return this._invoiceId;
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

  toProps(): InvoiceItemProps {
    return {
      id: this._id,
      invoiceId: this._invoiceId,
      description: this._description,
      quantity: this._quantity,
      unit: this._unit,
      unitPrice: this._unitPrice,
      lineTotal: this.lineTotal,
    };
  }
}
