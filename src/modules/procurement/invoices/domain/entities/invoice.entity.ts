import { generateId } from '@utils/uuid.util';

import { type InvoiceProps } from '../contracts/invoice-props.contract';
import { InvoiceStatus } from '../enums/invoice-status.enum';
import { InvoiceInvalidTransitionError } from '../errors/invoice-invalid-transition.error';

export class Invoice {
  private readonly _id: string;
  private readonly _tenantId: string;
  private readonly _number: number;
  private readonly _invoiceNumber: string;
  private readonly _supplierId: string;
  private readonly _orderId: string;
  private readonly _amount: number;
  private readonly _dueDate: Date | null;
  private _status: InvoiceStatus;
  private _notes: string | null;
  private _paidAt: Date | null;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: InvoiceProps) {
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._number = props.number;
    this._invoiceNumber = props.invoiceNumber;
    this._supplierId = props.supplierId;
    this._orderId = props.orderId;
    this._amount = props.amount;
    this._dueDate = props.dueDate;
    this._status = props.status;
    this._notes = props.notes;
    this._paidAt = props.paidAt;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    tenantId: string,
    number: number,
    invoiceNumber: string,
    supplierId: string,
    orderId: string,
    amount: number,
    dueDate: Date | null,
    notes: string | null,
  ): Invoice {
    return new Invoice({
      id: generateId(),
      tenantId,
      number,
      invoiceNumber,
      supplierId,
      orderId,
      amount,
      dueDate,
      status: InvoiceStatus.PENDING,
      notes,
      paidAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: InvoiceProps): Invoice {
    return new Invoice(props);
  }

  get id(): string {
    return this._id;
  }
  get tenantId(): string {
    return this._tenantId;
  }
  get number(): number {
    return this._number;
  }
  get invoiceNumber(): string {
    return this._invoiceNumber;
  }
  get supplierId(): string {
    return this._supplierId;
  }
  get orderId(): string {
    return this._orderId;
  }
  get amount(): number {
    return this._amount;
  }
  get dueDate(): Date | null {
    return this._dueDate;
  }
  get status(): InvoiceStatus {
    return this._status;
  }
  get notes(): string | null {
    return this._notes;
  }
  get paidAt(): Date | null {
    return this._paidAt;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }

  markPaid(): void {
    if (this._status !== InvoiceStatus.PENDING && this._status !== InvoiceStatus.OVERDUE) {
      throw new InvoiceInvalidTransitionError(this._status, InvoiceStatus.PAID);
    }
    this._status = InvoiceStatus.PAID;
    this._paidAt = new Date();
    this._updatedAt = new Date();
  }

  markOverdue(): void {
    if (this._status !== InvoiceStatus.PENDING) {
      throw new InvoiceInvalidTransitionError(this._status, InvoiceStatus.OVERDUE);
    }
    this._status = InvoiceStatus.OVERDUE;
    this._updatedAt = new Date();
  }
}
