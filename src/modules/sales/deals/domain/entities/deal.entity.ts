import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { type UnitOfMeasure } from '@core/domain/enums/unit-of-measure.enum';
import { generateId } from '@utils/uuid.util';

import { type DealProps } from '../contracts/deal-props.contract';
import { DealStatus } from '../enums/deal-status.enum';
import { DealInvalidTransitionError } from '../errors/deal-invalid-transition.error';
import { DealApprovedEvent } from '../events/deal-approved.event';
import { DealItem } from './deal-item.entity';

export class Deal extends AggregateRootBase {
  private _number: number;
  private _customerId: string;
  private _quotationId: string | null;
  private _status: DealStatus;
  private _notes: string | null;
  private _items: DealItem[];

  private constructor(props: DealProps) {
    super(props.id, props.tenantId);
    this._number = props.number;
    this._customerId = props.customerId;
    this._quotationId = props.quotationId;
    this._status = props.status;
    this._notes = props.notes;
    this._items = props.items.map((i) => DealItem.reconstitute(i));
  }

  static create(
    tenantId: string,
    number: number,
    customerId: string,
    quotationId: string | null,
    notes: string | null,
    items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unit: UnitOfMeasure;
      unitPrice: number;
    }>,
  ): Deal {
    const id = generateId();
    const dealItems = items.map((i) =>
      DealItem.create(id, i.itemType, i.itemId, i.description, i.quantity, i.unit, i.unitPrice),
    );
    return new Deal({
      id,
      tenantId,
      number,
      customerId,
      quotationId,
      status: DealStatus.PENDING,
      notes,
      subtotal: dealItems.reduce((acc, i) => acc + i.lineTotal, 0),
      total: dealItems.reduce((acc, i) => acc + i.lineTotal, 0),
      items: dealItems.map((i) => i.toProps()),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: DealProps): Deal {
    return new Deal(props);
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
  get status(): DealStatus {
    return this._status;
  }
  get notes(): string | null {
    return this._notes;
  }
  get items(): DealItem[] {
    return this._items;
  }
  get subtotal(): number {
    return Math.round(this._items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  }
  get total(): number {
    return this.subtotal;
  }

  approve(): void {
    if (this._status !== DealStatus.PENDING) {
      throw new DealInvalidTransitionError(this._status, DealStatus.APPROVED);
    }
    this._status = DealStatus.APPROVED;
    this.apply(
      new DealApprovedEvent(
        this._id,
        this._tenantId,
        this._customerId,
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

  cancel(): void {
    if (this._status !== DealStatus.PENDING) {
      throw new DealInvalidTransitionError(this._status, DealStatus.CANCELLED);
    }
    this._status = DealStatus.CANCELLED;
    this.touch();
  }

  markInvoiced(): void {
    if (this._status !== DealStatus.APPROVED) {
      throw new DealInvalidTransitionError(this._status, DealStatus.INVOICED);
    }
    this._status = DealStatus.INVOICED;
    this.touch();
  }
}
