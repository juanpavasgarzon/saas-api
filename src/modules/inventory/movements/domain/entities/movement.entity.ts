import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { generateId } from '@shared/utils/uuid.util';

import { type MovementProps } from '../contracts/movement-props.contract';
import { type MovementSource } from '../enums/movement-source.enum';
import { type MovementType } from '../enums/movement-type.enum';
import { MovementRegisteredEvent } from '../events/movement-registered.event';

export class Movement extends AggregateRootBase {
  private readonly _productId: string;
  private readonly _warehouseId: string | null;
  private readonly _toWarehouseId: string | null;
  private readonly _type: MovementType;
  private readonly _quantity: number;
  private readonly _source: MovementSource;
  private readonly _referenceId: string | null;
  private readonly _notes: string | null;
  private readonly _movementCreatedAt: Date;

  private constructor(props: MovementProps) {
    super(props.id, props.tenantId);
    this._productId = props.productId;
    this._warehouseId = props.warehouseId;
    this._toWarehouseId = props.toWarehouseId;
    this._type = props.type;
    this._quantity = props.quantity;
    this._source = props.source;
    this._referenceId = props.referenceId;
    this._notes = props.notes;
    this._movementCreatedAt = props.createdAt;
  }

  static create(
    tenantId: string,
    productId: string,
    warehouseId: string | null,
    toWarehouseId: string | null,
    type: MovementType,
    quantity: number,
    source: MovementSource,
    referenceId: string | null,
    notes: string | null,
  ): Movement {
    const now = new Date();
    const movement = new Movement({
      id: generateId(),
      tenantId,
      productId,
      warehouseId,
      toWarehouseId,
      type,
      quantity,
      source,
      referenceId,
      notes,
      createdAt: now,
    });
    movement.apply(
      new MovementRegisteredEvent(
        movement._id,
        tenantId,
        productId,
        warehouseId,
        toWarehouseId,
        type,
        quantity,
        source,
        referenceId,
      ),
    );
    return movement;
  }

  static reconstitute(props: MovementProps): Movement {
    return new Movement(props);
  }

  get productId(): string {
    return this._productId;
  }

  get warehouseId(): string | null {
    return this._warehouseId;
  }

  get toWarehouseId(): string | null {
    return this._toWarehouseId;
  }

  get type(): MovementType {
    return this._type;
  }

  get quantity(): number {
    return this._quantity;
  }

  get source(): MovementSource {
    return this._source;
  }

  get referenceId(): string | null {
    return this._referenceId;
  }

  get notes(): string | null {
    return this._notes;
  }

  override get createdAt(): Date {
    return this._movementCreatedAt;
  }
}
