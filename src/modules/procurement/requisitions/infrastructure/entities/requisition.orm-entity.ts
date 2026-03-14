import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { RequisitionStatus } from '../../domain/enums/requisition-status.enum';
import { RequisitionItemOrmEntity } from './requisition-item.orm-entity';

@Entity('requisitions')
@Index('IDX_requisitions_tenant_status', ['tenantId', 'status'])
export class RequisitionOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_requisitions_tenant')
  tenantId!: string;

  @Column()
  title!: string;

  @Column({ type: 'uuid', nullable: true, default: null })
  supplierId!: string | null;

  @Column({ type: 'uuid', nullable: true, default: null })
  supplierProspectId!: string | null;

  @Column({ type: 'enum', enum: RequisitionStatus, default: RequisitionStatus.DRAFT })
  status!: RequisitionStatus;

  @Column({ type: 'text', nullable: true, default: null })
  notes!: string | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal!: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  total!: number;

  @OneToMany(() => RequisitionItemOrmEntity, (item) => item.requisition, {
    cascade: true,
    eager: true,
  })
  items!: RequisitionItemOrmEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
