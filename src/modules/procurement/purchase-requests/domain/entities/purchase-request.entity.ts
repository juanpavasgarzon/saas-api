import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { generateId } from '@shared/utils/uuid.util';

import { type PurchaseRequestProps } from '../contracts/purchase-request-props.contract';
import { PurchaseRequestStatus } from '../enums/purchase-request-status.enum';
import { PurchaseRequestInvalidTransitionError } from '../errors/purchase-request-invalid-transition.error';
import { PurchaseRequestApprovedEvent } from '../events/purchase-request-approved.event';
import { PurchaseRequestItem } from './purchase-request-item.entity';

export class PurchaseRequest extends AggregateRootBase {
  private _title: string;
  private _vendorId: string | null;
  private _vendorProspectId: string | null;
  private _status: PurchaseRequestStatus;
  private _notes: string | null;
  private _items: PurchaseRequestItem[];

  private constructor(props: PurchaseRequestProps) {
    super(props.id, props.tenantId);
    this._title = props.title;
    this._vendorId = props.vendorId;
    this._vendorProspectId = props.vendorProspectId;
    this._status = props.status;
    this._notes = props.notes;
    this._items = props.items.map((i) => PurchaseRequestItem.reconstitute(i));
  }

  static create(
    tenantId: string,
    title: string,
    vendorId: string | null,
    vendorProspectId: string | null,
    notes: string | null,
    items: Array<{ description: string; quantity: number; unitPrice: number }>,
  ): PurchaseRequest {
    const id = generateId();
    const requestItems = items.map((item) =>
      PurchaseRequestItem.create(id, item.description, item.quantity, item.unitPrice),
    );

    return new PurchaseRequest({
      id,
      tenantId,
      title,
      vendorId,
      vendorProspectId,
      status: PurchaseRequestStatus.DRAFT,
      notes,
      items: requestItems.map((i) => i.toProps()),
      subtotal: requestItems.reduce((acc, i) => acc + i.lineTotal, 0),
      total: requestItems.reduce((acc, i) => acc + i.lineTotal, 0),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: PurchaseRequestProps): PurchaseRequest {
    return new PurchaseRequest(props);
  }

  get title(): string {
    return this._title;
  }

  get vendorId(): string | null {
    return this._vendorId;
  }

  get vendorProspectId(): string | null {
    return this._vendorProspectId;
  }

  get status(): PurchaseRequestStatus {
    return this._status;
  }

  get notes(): string | null {
    return this._notes;
  }

  get items(): PurchaseRequestItem[] {
    return this._items;
  }

  get subtotal(): number {
    return Math.round(this._items.reduce((acc, i) => acc + i.lineTotal, 0) * 100) / 100;
  }

  get total(): number {
    return this.subtotal;
  }

  submit(): void {
    if (this._status !== PurchaseRequestStatus.DRAFT) {
      throw new PurchaseRequestInvalidTransitionError(
        this._status,
        PurchaseRequestStatus.PENDING_REVIEW,
      );
    }
    this._status = PurchaseRequestStatus.PENDING_REVIEW;
    this.touch();
  }

  approve(): void {
    if (this._status !== PurchaseRequestStatus.PENDING_REVIEW) {
      throw new PurchaseRequestInvalidTransitionError(this._status, PurchaseRequestStatus.APPROVED);
    }
    this._status = PurchaseRequestStatus.APPROVED;
    this.apply(
      new PurchaseRequestApprovedEvent(
        this._id,
        this._tenantId,
        this._vendorId,
        this._vendorProspectId,
        this._items.map((i) => ({
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
    if (this._status !== PurchaseRequestStatus.PENDING_REVIEW) {
      throw new PurchaseRequestInvalidTransitionError(this._status, PurchaseRequestStatus.REJECTED);
    }
    this._status = PurchaseRequestStatus.REJECTED;
    this.touch();
  }
}
