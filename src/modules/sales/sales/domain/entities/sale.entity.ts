import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { type UnitOfMeasure } from '@shared/domain/enums/unit-of-measure.enum';
import { generateId } from '@shared/utils/uuid.util';

import { type SaleProps } from '../contracts/sale-props.contract';
import { SaleStatus } from '../enums/sale-status.enum';
import { SaleInvalidTransitionError } from '../errors/sale-invalid-transition.error';
import { SaleApprovedEvent } from '../events/sale-approved.event';
import { SaleItem } from './sale-item.entity';

export class Sale extends AggregateRootBase {
  private _number: number;
  private _customerId: string;
  private _quotationId: string | null;
  private _status: SaleStatus;
  private _notes: string | null;
  private _items: SaleItem[];

  private constructor(props: SaleProps) {
    super(props.id, props.tenantId);
    this._number = props.number;
    this._customerId = props.customerId;
    this._quotationId = props.quotationId;
    this._status = props.status;
    this._notes = props.notes;
    this._items = props.items.map((i) => SaleItem.reconstitute(i));
  }

  static create(
    tenantId: string,
    number: number,
    customerId: string,
    quotationId: string | null,
    notes: string | null,
    items: Array<{ description: string; quantity: number; unit: UnitOfMeasure; unitPrice: number }>,
  ): Sale {
    const id = generateId();
    const saleItems = items.map((i) =>
      SaleItem.create(id, i.description, i.quantity, i.unit, i.unitPrice),
    );
    return new Sale({
      id,
      tenantId,
      number,
      customerId,
      quotationId,
      status: SaleStatus.PENDING,
      notes,
      subtotal: saleItems.reduce((acc, i) => acc + i.lineTotal, 0),
      total: saleItems.reduce((acc, i) => acc + i.lineTotal, 0),
      items: saleItems.map((i) => i.toProps()),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: SaleProps): Sale {
    return new Sale(props);
  }

  get number(): number {
    return this._number;
  }
  get customerId(): string {
    return this._customerId;
  }
  get quotationId(): string | null {
    return this._quotationId;
  }
  get status(): SaleStatus {
    return this._status;
  }
  get notes(): string | null {
    return this._notes;
  }
  get items(): SaleItem[] {
    return this._items;
  }
  get subtotal(): number {
    return Math.round(this._items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  }
  get total(): number {
    return this.subtotal;
  }

  approve(): void {
    if (this._status !== SaleStatus.PENDING) {
      throw new SaleInvalidTransitionError(this._status, SaleStatus.APPROVED);
    }
    this._status = SaleStatus.APPROVED;
    this.apply(
      new SaleApprovedEvent(
        this._id,
        this._tenantId,
        this._customerId,
        this._items.map((i) => ({
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

  cancel(): void {
    if (this._status !== SaleStatus.PENDING) {
      throw new SaleInvalidTransitionError(this._status, SaleStatus.CANCELLED);
    }
    this._status = SaleStatus.CANCELLED;
    this.touch();
  }

  markInvoiced(): void {
    if (this._status !== SaleStatus.APPROVED) {
      throw new SaleInvalidTransitionError(this._status, SaleStatus.INVOICED);
    }
    this._status = SaleStatus.INVOICED;
    this.touch();
  }
}
