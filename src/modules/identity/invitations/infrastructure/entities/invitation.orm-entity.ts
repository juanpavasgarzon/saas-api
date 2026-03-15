import { Column, CreateDateColumn, Entity, Index, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { InvitationStatus } from '../../domain/enums/invitation-status.enum';

@Entity('invitations')
export class InvitationOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ type: 'uuid' })
  @Index()
  tenantId!: string;

  @Column()
  email!: string;

  @Column()
  role!: string;

  @Column({ unique: true })
  token!: string;

  @Column()
  url!: string;

  @Column({
    type: 'enum',
    enum: InvitationStatus,
    default: InvitationStatus.PENDING,
  })
  status!: InvitationStatus;

  @Column()
  expiresAt!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
