import { generateId } from '@shared/utils/uuid.util';

import { type MovementProps } from '../contracts/movement-props.contract';
import { type MovementType } from '../enums/movement-type.enum';

export class Movement {
  private readonly _id: string;
  private readonly _tenantId: string;
  private readonly _productId: string;
  private readonly _warehouseId: string | null;
  private readonly _type: MovementType;
  private readonly _quantity: number;
  private readonly _referenceId: string | null;
  private readonly _notes: string | null;
  private readonly _createdAt: Date;

  private constructor(props: MovementProps) {
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._productId = props.productId;
    this._warehouseId = props.warehouseId;
    this._type = props.type;
    this._quantity = props.quantity;
    this._referenceId = props.referenceId;
    this._notes = props.notes;
    this._createdAt = props.createdAt;
  }

  static create(
    tenantId: string,
    productId: string,
    warehouseId: string | null,
    type: MovementType,
    quantity: number,
    referenceId: string | null,
    notes: string | null,
  ): Movement {
    return new Movement({
      id: generateId(),
      tenantId,
      productId,
      warehouseId,
      type,
      quantity,
      referenceId,
      notes,
      createdAt: new Date(),
    });
  }

  static reconstitute(props: MovementProps): Movement {
    return new Movement(props);
  }

  get id(): string {
    return this._id;
  }

  get tenantId(): string {
    return this._tenantId;
  }

  get productId(): string {
    return this._productId;
  }

  get warehouseId(): string | null {
    return this._warehouseId;
  }

  get type(): MovementType {
    return this._type;
  }

  get quantity(): number {
    return this._quantity;
  }

  get referenceId(): string | null {
    return this._referenceId;
  }

  get notes(): string | null {
    return this._notes;
  }

  get createdAt(): Date {
    return this._createdAt;
  }
}
