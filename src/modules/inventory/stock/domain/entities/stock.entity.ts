import { ConflictError } from '@core/domain/errors/conflict.error';
import { generateId } from '@utils/uuid.util';

import { type StockProps } from '../contracts/stock-props.contract';

export class Stock {
  private readonly _id: string;
  private readonly _tenantId: string;
  private readonly _productId: string;
  private readonly _warehouseId: string;
  private _quantity: number;
  private _reservedQuantity: number;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: StockProps) {
    this._id = props.id;
    this._tenantId = props.tenantId;
    this._productId = props.productId;
    this._warehouseId = props.warehouseId;
    this._quantity = props.quantity;
    this._reservedQuantity = props.reservedQuantity;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(tenantId: string, productId: string, warehouseId: string): Stock {
    return new Stock({
      id: generateId(),
      tenantId,
      productId,
      warehouseId,
      quantity: 0,
      reservedQuantity: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: StockProps): Stock {
    return new Stock(props);
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

  get warehouseId(): string {
    return this._warehouseId;
  }

  get quantity(): number {
    return this._quantity;
  }

  get reservedQuantity(): number {
    return this._reservedQuantity;
  }

  get availableQuantity(): number {
    return this._quantity - this._reservedQuantity;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  addQuantity(qty: number): void {
    this._quantity += qty;
    this._updatedAt = new Date();
  }

  subtractQuantity(qty: number): void {
    if (this.availableQuantity < qty) {
      throw new ConflictError(
        `Insufficient stock. Available: ${this.availableQuantity}, requested: ${qty}`,
      );
    }
    this._quantity -= qty;
    this._updatedAt = new Date();
  }

  reserve(qty: number): void {
    if (this.availableQuantity < qty) {
      throw new ConflictError(
        `Insufficient available stock to reserve. Available: ${this.availableQuantity}, requested: ${qty}`,
      );
    }
    this._reservedQuantity += qty;
    this._updatedAt = new Date();
  }

  releaseReservation(qty: number): void {
    this._reservedQuantity = Math.max(0, this._reservedQuantity - qty);
    this._updatedAt = new Date();
  }
}
