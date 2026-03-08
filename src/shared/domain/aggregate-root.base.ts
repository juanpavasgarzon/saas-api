import { AggregateRoot } from '@nestjs/cqrs';

export abstract class AggregateRootBase extends AggregateRoot {
  protected readonly _id: string;
  protected readonly _tenantId: string;
  protected readonly _createdAt: Date;
  protected _updatedAt: Date;

  constructor(id: string, tenantId: string) {
    super();
    this._id = id;
    this._tenantId = tenantId;
    this._createdAt = new Date();
    this._updatedAt = new Date();
  }

  get id(): string {
    return this._id;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  protected touch(): void {
    this._updatedAt = new Date();
  }
}
