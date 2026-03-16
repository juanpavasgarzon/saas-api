import { Column, CreateDateColumn, Entity, PrimaryColumn, Unique, UpdateDateColumn } from 'typeorm';

import { InboxMessageStatus } from '../../domain/enums/inbox-message-status.enum';

@Entity('inbox_messages')
@Unique('UQ_inbox_messageId_consumer', ['messageId', 'consumer'])
export class InboxMessageOrmEntity {
  @PrimaryColumn('uuid')
  id!: string;

  @Column({ type: 'varchar' })
  messageId!: string;

  @Column({ type: 'varchar' })
  consumer!: string;

  @Column({ type: 'varchar' })
  eventName!: string;

  @Column({ type: 'jsonb' })
  payload!: Record<string, unknown>;

  @Column({
    type: 'enum',
    enum: InboxMessageStatus,
    enumName: 'inbox_message_status_enum',
    default: InboxMessageStatus.RECEIVED,
  })
  status!: InboxMessageStatus;

  @Column({ type: 'text', nullable: true })
  lastError!: string | null;

  @Column({ type: 'timestamp', nullable: true })
  processedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
