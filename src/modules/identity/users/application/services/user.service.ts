import { Inject, Injectable } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';

import { UserRepository } from '../../domain/contracts/user-repository.contract';
import { User } from '../../domain/entities/user.entity';
import { UserRole } from '../../domain/enums/user-role.enum';
import { USER_REPOSITORY } from '../../domain/tokens/user-repository.token';
import { CreateUserCommand } from '../commands/create-user/create-user.command';
import { HashService } from '../contracts/hash-service.contract';
import { GetUserQuery } from '../queries/get-user/get-user.query';
import { HASH_SERVICE } from '../tokens/hash-service.token';

@Injectable()
export class UserService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: HashService,
  ) {}

  async createUser(
    tenantId: string,
    email: string,
    password: string,
    role: UserRole = UserRole.USER,
  ): Promise<string> {
    return this.commandBus.execute<CreateUserCommand, string>(
      new CreateUserCommand(tenantId, email, password, role),
    );
  }

  async getUserById(id: string): Promise<User> {
    return this.queryBus.execute<GetUserQuery, User>(new GetUserQuery(id));
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async validateCredentials(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValid = await this.hashService.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    return user;
  }
}
