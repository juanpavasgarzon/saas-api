import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';
import { generateId } from '@utils/uuid.util';

import { type QuotationProps } from '../contracts/quotation-props.contract';
import { QuotationStatus } from '../enums/quotation-status.enum';
import { QuotationInvalidTransitionError } from '../errors/quotation-invalid-transition.error';
import { QuotationAcceptedEvent } from '../events/quotation-accepted.event';
import { QuotationExpiredEvent } from '../events/quotation-expired.event';
import { QuotationRejectedEvent } from '../events/quotation-rejected.event';
import { QuotationItem } from './quotation-item.entity';

export class Quotation extends AggregateRootBase {
  private _number: number;
  private _title: string;
  private _customerId: string | null;
  private _prospectId: string | null;
  private _status: QuotationStatus;
  private _notes: string | null;
  private _validUntil: Date | null;
  private _items: QuotationItem[];

  private constructor(props: QuotationProps) {
    super(props.id, props.tenantId);
    this._number = props.number;
    this._title = props.title;
    this._customerId = props.customerId;
    this._prospectId = props.prospectId;
    this._status = props.status;
    this._notes = props.notes;
    this._validUntil = props.validUntil;
    this._items = props.items.map((i) => QuotationItem.reconstitute(i));
  }

  static create(
    tenantId: string,
    number: number,
    title: string,
    customerId: string | null,
    prospectId: string | null,
    notes: string | null,
    validUntil: Date | null,
    items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
    }>,
  ): Quotation {
    const id = generateId();
    const quotationItems = items.map((item) =>
      QuotationItem.create(
        id,
        item.itemType,
        item.itemId,
        item.description,
        item.quantity,
        item.unit,
        item.unitPrice,
      ),
    );

    return new Quotation({
      id,
      tenantId,
      number,
      title,
      customerId,
      prospectId,
      status: QuotationStatus.DRAFT,
      notes,
      validUntil,
      subtotal: quotationItems.reduce((acc, i) => acc + i.lineTotal, 0),
      total: quotationItems.reduce((acc, i) => acc + i.lineTotal, 0),
      items: quotationItems.map((i) => i.toProps()),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: QuotationProps): Quotation {
    return new Quotation(props);
  }

  get number(): number {
    return this._number;
  }

  get title(): string {
    return this._title;
  }

  get customerId(): string | null {
    return this._customerId;
  }

  get prospectId(): string | null {
    return this._prospectId;
  }

  get status(): QuotationStatus {
    return this._status;
  }

  get notes(): string | null {
    return this._notes;
  }

  get validUntil(): Date | null {
    return this._validUntil;
  }

  get items(): QuotationItem[] {
    return this._items;
  }

  get subtotal(): number {
    return Math.round(this._items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  }

  get total(): number {
    return this.subtotal;
  }

  update(
    title: string,
    notes: string | null,
    validUntil: Date | null,
    items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
    }>,
  ): void {
    if (this._status !== QuotationStatus.DRAFT) {
      throw new QuotationInvalidTransitionError(this._status, 'update');
    }
    this._title = title;
    this._notes = notes;
    this._validUntil = validUntil;
    this._items = items.map((item) =>
      QuotationItem.create(
        this._id,
        item.itemType,
        item.itemId,
        item.description,
        item.quantity,
        item.unit,
        item.unitPrice,
      ),
    );
    this.touch();
  }

  send(): void {
    if (this._status !== QuotationStatus.DRAFT) {
      throw new QuotationInvalidTransitionError(this._status, QuotationStatus.SENT);
    }
    this._status = QuotationStatus.SENT;
    this.touch();
  }

  accept(): void {
    if (this._status !== QuotationStatus.SENT) {
      throw new QuotationInvalidTransitionError(this._status, QuotationStatus.ACCEPTED);
    }
    this._status = QuotationStatus.ACCEPTED;
    this.apply(
      new QuotationAcceptedEvent(
        this._id,
        this._tenantId,
        this._customerId,
        this._prospectId,
        this._items.map((i) => ({
          itemType: i.itemType,
          itemId: i.itemId,
          description: i.description,
          quantity: i.quantity,
          unit: i.unit,
          unitPrice: i.unitPrice,
          lineTotal: i.lineTotal,
        })),
      ),
    );
    this.touch();
  }

  reject(): void {
    if (this._status !== QuotationStatus.SENT) {
      throw new QuotationInvalidTransitionError(this._status, QuotationStatus.REJECTED);
    }
    this._status = QuotationStatus.REJECTED;
    this.apply(
      new QuotationRejectedEvent(
        this._id,
        this._tenantId,
        this._items.map((i) => ({ itemType: i.itemType, itemId: i.itemId, quantity: i.quantity })),
      ),
    );
    this.touch();
  }

  expire(): void {
    if (this._status !== QuotationStatus.DRAFT && this._status !== QuotationStatus.SENT) {
      throw new QuotationInvalidTransitionError(this._status, QuotationStatus.EXPIRED);
    }
    this._status = QuotationStatus.EXPIRED;
    this.apply(
      new QuotationExpiredEvent(
        this._id,
        this._tenantId,
        this._items.map((i) => ({ itemType: i.itemType, itemId: i.itemId, quantity: i.quantity })),
      ),
    );
    this.touch();
  }

  canBeDeleted(): void {
    if (
      this._status === QuotationStatus.ACCEPTED ||
      this._status === QuotationStatus.REJECTED ||
      this._status === QuotationStatus.EXPIRED
    ) {
      throw new QuotationInvalidTransitionError(this._status, 'delete');
    }
  }

  assignCustomer(customerId: string): void {
    this._customerId = customerId;
    this._prospectId = null;
    this.touch();
  }
}
