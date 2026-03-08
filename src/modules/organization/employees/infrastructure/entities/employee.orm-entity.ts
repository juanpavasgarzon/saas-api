import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { EmployeeStatus } from '../../domain/enums/employee-status.enum';

@Entity('employees')
@Index('IDX_employees_tenant_department', ['tenantId', 'department'])
@Index('IDX_employees_tenant_status', ['tenantId', 'status'])
export class EmployeeOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  @Index('IDX_employees_tenant')
  tenantId!: string;

  @Column()
  firstName!: string;

  @Column()
  lastName!: string;

  // Unique per tenant — enforced by UQ_employees_tenant_email composite constraint.
  @Column()
  email!: string;

  @Column()
  position!: string;

  @Column()
  department!: string;

  @Column({
    type: 'enum',
    enum: EmployeeStatus,
    default: EmployeeStatus.ACTIVE,
  })
  status!: EmployeeStatus;

  @Column({ type: 'date' })
  hiredAt!: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  basicSalary!: number;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
