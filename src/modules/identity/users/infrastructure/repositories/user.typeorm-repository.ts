import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { UserProps } from '../../domain/contracts/user-props.contract';
import { IUserRepository } from '../../domain/contracts/user-repository.contract';
import { User } from '../../domain/entities/user.entity';
import { Email } from '../../domain/value-objects/email.value-object';
import { UserOrmEntity } from '../entities/user.orm-entity';

@Injectable()
export class UserTypeOrmRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repository: Repository<UserOrmEntity>,
  ) {}

  async findById(id: string): Promise<User | null> {
    const orm = await this.repository.findOne({ where: { id } });
    if (!orm) {
      return null;
    }

    return this.toDomain(orm);
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repository.findOne({
      where: { email: email.toLowerCase().trim() },
    });
    if (!orm) {
      return null;
    }

    return this.toDomain(orm);
  }

  async save(user: User): Promise<void> {
    const orm = this.toOrm(user);
    await this.repository.save(orm);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async findAll(tenantId: string, page: number, limit: number): Promise<PaginatedResult<User>> {
    const [items, total] = await this.repository.findAndCount({
      where: { tenantId },
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { items: items.map((orm) => this.toDomain(orm)), total, page, limit };
  }

  async existsByEmail(email: string): Promise<boolean> {
    return this.repository.exists({
      where: { email: email.toLowerCase().trim() },
    });
  }

  private toDomain(orm: UserOrmEntity): User {
    const props: UserProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      email: new Email(orm.email),
      passwordHash: orm.passwordHash,
      role: orm.role,
      isActive: orm.isActive,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return User.reconstitute(props);
  }

  private toOrm(user: User): UserOrmEntity {
    const orm = new UserOrmEntity();
    orm.id = user.id;
    orm.tenantId = user.tenantId;
    orm.email = user.email.value;
    orm.passwordHash = user.passwordHash;
    orm.role = user.role;
    orm.isActive = user.isActive;
    return orm;
  }
}
