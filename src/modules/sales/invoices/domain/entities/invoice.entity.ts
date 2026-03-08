import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';
import { generateId } from '@shared/utils/uuid.util';

import { type InvoiceProps } from '../contracts/invoice-props.contract';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { InvoiceInvalidTransitionError } from '../errors/invoice-invalid-transition.error';
import { InvoiceItem } from './invoice-item.entity';

export class Invoice extends AggregateRootBase {
  private _number: number;
  private _saleId: string;
  private _customerId: string;
  private _status: InvoiceStatus;
  private _notes: string | null;
  private _sentAt: Date | null;
  private _paidAt: Date | null;
  private _items: InvoiceItem[];

  private constructor(props: InvoiceProps) {
    super(props.id, props.tenantId);
    this._number = props.number;
    this._saleId = props.saleId;
    this._customerId = props.customerId;
    this._status = props.status;
    this._notes = props.notes;
    this._sentAt = props.sentAt;
    this._paidAt = props.paidAt;
    this._items = props.items.map((i) => InvoiceItem.reconstitute(i));
  }

  static createFromSale(
    tenantId: string,
    number: number,
    saleId: string,
    customerId: string,
    items: Array<{
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
      lineTotal: number;
    }>,
  ): Invoice {
    const id = generateId();
    const invoiceItems = items.map((i) =>
      InvoiceItem.create(id, i.description, i.quantity, i.unit, i.unitPrice),
    );
    return new Invoice({
      id,
      tenantId,
      number,
      saleId,
      customerId,
      status: InvoiceStatus.DRAFT,
      notes: null,
      sentAt: null,
      paidAt: null,
      subtotal: invoiceItems.reduce((acc, i) => acc + i.lineTotal, 0),
      total: invoiceItems.reduce((acc, i) => acc + i.lineTotal, 0),
      items: invoiceItems.map((i) => i.toProps()),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  get number(): number {
    return this._number;
  }
  get saleId(): string {
    return this._saleId;
  }
  get customerId(): string {
    return this._customerId;
  }
  get status(): InvoiceStatus {
    return this._status;
  }
  get notes(): string | null {
    return this._notes;
  }
  get sentAt(): Date | null {
    return this._sentAt;
  }
  get paidAt(): Date | null {
    return this._paidAt;
  }
  get items(): InvoiceItem[] {
    return this._items;
  }
  get subtotal(): number {
    return Math.round(this._items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  }
  get total(): number {
    return this.subtotal;
  }

  send(): void {
    if (this._status !== InvoiceStatus.DRAFT) {
      throw new InvoiceInvalidTransitionError(this._status, InvoiceStatus.SENT);
    }
    this._status = InvoiceStatus.SENT;
    this._sentAt = new Date();
    this.touch();
  }

  pay(): void {
    if (this._status !== InvoiceStatus.SENT) {
      throw new InvoiceInvalidTransitionError(this._status, InvoiceStatus.PAID);
    }
    this._status = InvoiceStatus.PAID;
    this._paidAt = new Date();
    this.touch();
  }

  cancel(): void {
    if (this._status !== InvoiceStatus.DRAFT && this._status !== InvoiceStatus.SENT) {
      throw new InvoiceInvalidTransitionError(this._status, InvoiceStatus.CANCELLED);
    }
    this._status = InvoiceStatus.CANCELLED;
    this.touch();
  }
}
