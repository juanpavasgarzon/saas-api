import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { CompanyPlan } from '../../domain/enums/company-plan.enum';

@Entity('companies')
export class CompanyOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ length: 255 })
  name!: string;

  @Column({ length: 255, unique: true })
  slug!: string;

  @Column({ type: 'enum', enum: CompanyPlan, default: CompanyPlan.STARTER })
  plan!: CompanyPlan;

  @Column({ type: 'text', nullable: true, default: null })
  logo!: string | null;

  @Column({ default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
