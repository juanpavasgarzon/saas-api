import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { IUserRepository } from '../../../domain/contracts/user-repository.contract';
import { User } from '../../../domain/entities/user.entity';
import { UserEmailAlreadyExistsError } from '../../../domain/errors/user-email-already-exists.error';
import { USER_REPOSITORY } from '../../../domain/tokens/user-repository.token';
import { HashService } from '../../contracts/hash-service.contract';
import { HASH_SERVICE } from '../../tokens/hash-service.token';
import { CreateUserCommand } from './create-user.command';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand, string> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: HashService,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const exists = await this.userRepository.existsByEmail(command.email);
    if (exists) {
      throw new UserEmailAlreadyExistsError(command.email);
    }

    const passwordHash = await this.hashService.hash(command.password);
    const user = User.create(command.tenantId, command.email, passwordHash, command.role);

    await this.userRepository.save(user);
    return user.id;
  }
}
