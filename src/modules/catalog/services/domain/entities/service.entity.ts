import { AggregateRootBase } from '@core/domain/aggregate-root.base';
import { ConflictError } from '@core/domain/errors/conflict.error';
import { generateId } from '@utils/uuid.util';

import { type ServiceProps } from '../contracts/service-props.contract';

export class Service extends AggregateRootBase {
  private _name: string;
  private _description: string | null;
  private _unit: string;
  private _category: string | null;
  private _isActive: boolean;

  private constructor(props: ServiceProps) {
    super(props.id, props.tenantId);
    this._name = props.name;
    this._description = props.description;
    this._unit = props.unit;
    this._category = props.category;
    this._isActive = props.isActive;
  }

  static create(
    tenantId: string,
    name: string,
    description: string | null,
    unit: string,
    category: string | null,
  ): Service {
    return new Service({
      id: generateId(),
      tenantId,
      name,
      description,
      unit,
      category,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: ServiceProps): Service {
    return new Service(props);
  }

  get name(): string {
    return this._name;
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
      throw new ConflictError('Service is already inactive');
    }
    this._isActive = false;
    this.touch();
  }

  activate(): void {
    if (this._isActive) {
      throw new ConflictError('Service is already active');
    }
    this._isActive = true;
    this.touch();
  }
}
