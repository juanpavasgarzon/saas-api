import { Column, Entity, Index, OneToMany, PrimaryColumn } from 'typeorm';

import { AssetCategory } from '../../domain/enums/asset-category.enum';
import { AssetStatus } from '../../domain/enums/asset-status.enum';
import { AssetAssignmentOrmEntity } from './asset-assignment.orm-entity';

@Entity('assets')
export class AssetOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_assets_tenant')
  tenantId!: string;

  @Column({ type: 'integer' })
  number!: number;

  @Column()
  name!: string;

  @Column({ type: 'enum', enum: AssetCategory })
  category!: AssetCategory;

  @Column({ type: 'varchar', nullable: true, default: null })
  serialNumber!: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  description!: string | null;

  @Column({ type: 'enum', enum: AssetStatus, default: AssetStatus.ACTIVE })
  @Index('IDX_assets_tenant_status')
  status!: AssetStatus;

  @Column({ type: 'date', nullable: true, default: null })
  purchaseDate!: Date | null;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, default: null })
  purchaseValue!: number | null;

  @OneToMany(() => AssetAssignmentOrmEntity, (a) => a.asset, { cascade: true, eager: true })
  assignments!: AssetAssignmentOrmEntity[];

  @Column({ type: 'timestamp' })
  createdAt!: Date;

  @Column({ type: 'timestamp' })
  updatedAt!: Date;
}
