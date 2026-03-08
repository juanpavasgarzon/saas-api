import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ProjectStatus } from '../../domain/enums/project-status.enum';
import { ProjectMemberOrmEntity } from './project-member.orm-entity';

@Entity('projects')
@Index('IDX_projects_tenant_status', ['tenantId', 'status'])
@Index('IDX_projects_tenant_customer', ['tenantId', 'customerId'])
export class ProjectOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_projects_tenant')
  tenantId!: string;

  @Column()
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @Column('uuid')
  customerId!: string;

  @Column({
    type: 'enum',
    enum: ProjectStatus,
    default: ProjectStatus.PLANNING,
  })
  status!: ProjectStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  budget!: number | null;

  @Column({ type: 'date', nullable: true })
  startDate!: Date | null;

  @Column({ type: 'date', nullable: true })
  endDate!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @OneToMany(() => ProjectMemberOrmEntity, (member) => member.project, {
    cascade: true,
  })
  members!: ProjectMemberOrmEntity[];
}
