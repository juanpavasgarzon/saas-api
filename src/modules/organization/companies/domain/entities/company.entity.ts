import { generateId } from '@shared/utils/uuid.util';

import { type CompanyProps } from '../contracts/company-props.contract';
import { CompanyPlan } from '../enums/company-plan.enum';

export class Company {
  private readonly _id: string;
  private _name: string;
  private _slug: string;
  private _plan: CompanyPlan;
  private _logo: string | null;
  private _isActive: boolean;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  private constructor(props: CompanyProps) {
    this._id = props.id;
    this._name = props.name;
    this._slug = props.slug;
    this._plan = props.plan;
    this._logo = props.logo;
    this._isActive = props.isActive;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(name: string): Company {
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    return new Company({
      id: generateId(),
      name,
      slug,
      plan: CompanyPlan.STARTER,
      logo: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  static reconstitute(props: CompanyProps): Company {
    return new Company(props);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get slug(): string {
    return this._slug;
  }

  get plan(): CompanyPlan {
    return this._plan;
  }

  get logo(): string | null {
    return this._logo;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  update(name: string, logo: string | null): void {
    this._name = name;
    if (logo !== null) {
      this._logo = logo;
    }
    this._updatedAt = new Date();
  }

  upgradePlan(plan: CompanyPlan): void {
    this._plan = plan;
    this._updatedAt = new Date();
  }

  deactivate(): void {
    this._isActive = false;
    this._updatedAt = new Date();
  }

  toJSON(): CompanyProps {
    return {
      id: this._id,
      name: this._name,
      slug: this._slug,
      plan: this._plan,
      logo: this._logo,
      isActive: this._isActive,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
