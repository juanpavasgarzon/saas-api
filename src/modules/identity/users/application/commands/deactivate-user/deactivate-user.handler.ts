import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ForbiddenError } from '@shared/domain/errors/forbidden.error';

import { UserRepository } from '../../../domain/contracts/user-repository.contract';
import { UserNotFoundError } from '../../../domain/errors/user-not-found.error';
import { USER_REPOSITORY } from '../../../domain/tokens/user-repository.token';
import { DeactivateUserCommand } from './deactivate-user.command';

@CommandHandler(DeactivateUserCommand)
export class DeactivateUserHandler implements ICommandHandler<DeactivateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: DeactivateUserCommand): Promise<void> {
    if (command.userId === command.requesterId) {
      throw new ForbiddenError('You cannot deactivate your own account');
    }

    const user = await this.userRepository.findById(command.userId);
    if (!user) {
      throw new UserNotFoundError(command.userId);
    }

    user.deactivate();
    await this.userRepository.save(user);
  }
}
