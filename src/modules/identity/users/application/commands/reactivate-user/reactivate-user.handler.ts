import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserRepository } from '../../../domain/contracts/user-repository.contract';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error';
import { USER_REPOSITORY } from '../../../domain/tokens/user-repository.token';
import { ReactivateUserCommand } from './reactivate-user.command';

@CommandHandler(ReactivateUserCommand)
export class ReactivateUserHandler implements ICommandHandler<ReactivateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: ReactivateUserCommand): Promise<void> {
    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new UserNotFoundError(command.userId);
    }

    user.activate();
    await this.userRepository.save(user);
  }
}
