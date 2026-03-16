import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { INBOX_REPOSITORY } from '../../application/tokens/inbox-repository.token';
import { InboxMessageOrmEntity } from './inbox-message.orm-entity';
import { InboxMessageRepository } from './inbox-message.repository';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([InboxMessageOrmEntity])],
  providers: [{ provide: INBOX_REPOSITORY, useClass: InboxMessageRepository }],
  exports: [INBOX_REPOSITORY],
})
export class InboxModule {}
