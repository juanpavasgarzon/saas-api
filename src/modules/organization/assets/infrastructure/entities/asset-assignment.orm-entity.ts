import { Column, Entity, Index, ManyToOne, PrimaryColumn } from 'typeorm';

import { AssetOrmEntity } from './asset.orm-entity';

@Entity('asset_assignments')
export class AssetAssignmentOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_asset_assignments_asset')
  assetId!: string;

  @ManyToOne(() => AssetOrmEntity, (a) => a.assignments, { onDelete: 'CASCADE' })
  asset!: AssetOrmEntity;

  @Column({ type: 'uuid', nullable: true, default: null })
  projectId!: string | null;

  @Column({ type: 'uuid', nullable: true, default: null })
  employeeId!: string | null;

  @Column({ type: 'timestamp' })
  assignedAt!: Date;

  @Column({ type: 'timestamp', nullable: true, default: null })
  returnedAt!: Date | null;
}
