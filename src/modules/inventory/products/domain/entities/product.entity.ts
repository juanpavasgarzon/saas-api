import { AggregateRootBase } from '@shared/domain/aggregate-root.base';
import { ConflictError } from '@shared/domain/errors/conflict.error';
import { generateId } from '@shared/utils/uuid.util';

import { type ProductProps } from '../contracts/product-props.contract';

export class Product extends AggregateRootBase {
  private _name: string;
  private _sku: string;
  private _description: string | null;
  private _unit: string;
  private _category: string | null;
  private _isActive: boolean;

  private constructor(props: ProductProps) {
    super(props.id, props.tenantId);
    this._name = props.name;
    this._sku = props.sku;
    this._description = props.description;
    this._unit = props.unit;
    this._category = props.category;
    this._isActive = props.isActive;
  }

  static create(
    tenantId: string,
    name: string,
    sku: string,
    description: string | null,
    unit: string,
    category: string | null,
  ): Product {
    return new Product({
      id: generateId(),
      tenantId,
      name,
      sku: sku.toUpperCase().trim(),
      description,
      unit,
      category,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(props);
  }

  get name(): string {
    return this._name;
  }

  get sku(): string {
    return this._sku;
  }

  get description(): string | null {
    return this._description;
  }

  get unit(): string {
    return this._unit;
  }

  get category(): string | null {
    return this._category;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  update(name: string, description: string | null, unit: string, category: string | null): void {
    this._name = name;
    this._description = description;
    this._unit = unit;
    this._category = category;
    this.touch();
  }

  deactivate(): void {
    if (!this._isActive) {
      throw new ConflictError('Product is already inactive');
    }
    this._isActive = false;
    this.touch();
  }

  activate(): void {
    if (this._isActive) {
      throw new ConflictError('Product is already active');
    }
    this._isActive = true;
    this.touch();
  }
}
