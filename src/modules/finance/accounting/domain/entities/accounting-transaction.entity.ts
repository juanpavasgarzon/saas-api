import { generateId } from '@shared/utils/uuid.util';

import { type AccountingTransactionProps } from '../contracts/accounting-transaction-props.contract';
import { type TransactionType } from '../enums/transaction-type.enum';

export class AccountingTransaction {
  private readonly _id: string;
  private readonly _tenantId: string;
  private readonly _type: TransactionType;
  private readonly _amount: number;
  private readonly _description: string;
  private readonly _reference: string | null;
  private readonly _date: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: AccountingTransactionProps) {
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._type = props.type;
    this._amount = props.amount;
    this._description = props.description;
    this._reference = props.reference;
    this._date = props.date;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(
    tenantId: string,
    type: TransactionType,
    amount: number,
    description: string,
    reference: string | null = null,
    date?: Date,
  ): AccountingTransaction {
    return new AccountingTransaction({
      id: generateId(),
      tenantId,
      type,
      amount,
      description,
      reference,
      date: date ?? new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: AccountingTransactionProps): AccountingTransaction {
    return new AccountingTransaction(props);
  }

  get id(): string {
    return this._id;
  }
  get tenantId(): string {
    return this._tenantId;
  }
  get type(): TransactionType {
    return this._type;
  }
  get amount(): number {
    return this._amount;
  }
  get description(): string {
    return this._description;
  }
  get reference(): string | null {
    return this._reference;
  }
  get date(): Date {
    return this._date;
  }
  get createdAt(): Date {
    return this._createdAt;
  }
  get updatedAt(): Date {
    return this._updatedAt;
  }
}
