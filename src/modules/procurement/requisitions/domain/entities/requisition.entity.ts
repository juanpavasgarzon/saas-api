import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { type LineItemType } from '@core/domain/enums/line-item-type.enum';
import { generateId } from '@utils/uuid.util';

import { type RequisitionProps } from '../contracts/requisition-props.contract';
import { RequisitionStatus } from '../enums/requisition-status.enum';
import { RequisitionInvalidTransitionError } from '../errors/requisition-invalid-transition.error';
import { RequisitionApprovedEvent } from '../events/requisition-approved.event';
import { RequisitionItem } from './requisition-item.entity';

export class Requisition extends AggregateRootBase {
  private _title: string;
  private _supplierId: string | null;
  private _supplierProspectId: string | null;
  private _status: RequisitionStatus;
  private _notes: string | null;
  private _items: RequisitionItem[];

  private constructor(props: RequisitionProps) {
    super(props.id, props.tenantId);
    this._title = props.title;
    this._supplierId = props.supplierId;
    this._supplierProspectId = props.supplierProspectId;
    this._status = props.status;
    this._notes = props.notes;
    this._items = props.items.map((i) => RequisitionItem.reconstitute(i));
  }

  static create(
    tenantId: string,
    title: string,
    supplierId: string | null,
    supplierProspectId: string | null,
    notes: string | null,
    items: Array<{
      itemType: LineItemType;
      itemId: string;
      description: string;
      quantity: number;
      unitPrice: number;
    }>,
  ): Requisition {
    const id = generateId();
    const requestItems = items.map((item) =>
      RequisitionItem.create(
        id,
        item.itemType,
        item.itemId,
        item.description,
        item.quantity,
        item.unitPrice,
      ),
    );

    return new Requisition({
      id,
      tenantId,
      title,
      supplierId,
      supplierProspectId,
      status: RequisitionStatus.DRAFT,
      notes,
      items: requestItems.map((i) => i.toProps()),
      subtotal: requestItems.reduce((acc, i) => acc + i.lineTotal, 0),
      total: requestItems.reduce((acc, i) => acc + i.lineTotal, 0),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: RequisitionProps): Requisition {
    return new Requisition(props);
  }

  get title(): string {
    return this._title;
  }

  get supplierId(): string | null {
    return this._supplierId;
  }

  get supplierProspectId(): string | null {
    return this._supplierProspectId;
  }

  get status(): RequisitionStatus {
    return this._status;
  }

  get notes(): string | null {
    return this._notes;
  }

  get items(): RequisitionItem[] {
    return this._items;
  }

  get subtotal(): number {
    return Math.round(this._items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  }

  get total(): number {
    return this.subtotal;
  }

  submit(): void {
    if (this._status !== RequisitionStatus.DRAFT) {
      throw new RequisitionInvalidTransitionError(this._status, RequisitionStatus.PENDING_REVIEW);
    }
    this._status = RequisitionStatus.PENDING_REVIEW;
    this.touch();
  }

  approve(): void {
    if (this._status !== RequisitionStatus.PENDING_REVIEW) {
      throw new RequisitionInvalidTransitionError(this._status, RequisitionStatus.APPROVED);
    }
    this._status = RequisitionStatus.APPROVED;
    this.apply(
      new RequisitionApprovedEvent(
        this._id,
        this._tenantId,
        this._supplierId,
        this._supplierProspectId,
        this._items.map((i) => ({
          itemType: i.itemType,
          itemId: i.itemId,
          description: i.description,
          quantity: i.quantity,
          unitPrice: i.unitPrice,
          lineTotal: i.lineTotal,
        })),
      ),
    );
    this.touch();
  }

  reject(): void {
    if (this._status !== RequisitionStatus.PENDING_REVIEW) {
      throw new RequisitionInvalidTransitionError(this._status, RequisitionStatus.REJECTED);
    }
    this._status = RequisitionStatus.REJECTED;
    this.touch();
  }
}
