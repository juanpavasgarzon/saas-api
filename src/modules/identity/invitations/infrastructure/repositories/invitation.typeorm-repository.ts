import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IInvitationRepository } from '../../domain/contracts/invitation-repository.contract';
import { Invitation } from '../../domain/entities/invitation.entity';
import { InvitationOrmEntity } from '../entities/invitation.orm-entity';

@Injectable()
export class InvitationTypeOrmRepository implements IInvitationRepository {
  constructor(
    @InjectRepository(InvitationOrmEntity)
    private readonly repo: Repository<InvitationOrmEntity>,
  ) {}

  async findByToken(token: string): Promise<Invitation | null> {
    const orm = await this.repo.findOne({ where: { token } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByTenantAndEmail(tenantId: string, email: string): Promise<Invitation | null> {
    const orm = await this.repo.findOne({
      where: { tenantId, email: email.toLowerCase().trim() },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async save(invitation: Invitation): Promise<void> {
    await this.repo.save(this.toOrm(invitation));
  }

  private toDomain(orm: InvitationOrmEntity): Invitation {
    return Invitation.reconstitute({
      id: orm.id,
      tenantId: orm.tenantId,
      email: orm.email,
      role: orm.role,
      token: orm.token,
      status: orm.status,
      expiresAt: orm.expiresAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  private toOrm(invitation: Invitation): InvitationOrmEntity {
    const orm = new InvitationOrmEntity();
    orm.id = invitation.id;
    orm.tenantId = invitation.tenantId;
    orm.email = invitation.email;
    orm.role = invitation.role;
    orm.token = invitation.token;
    orm.status = invitation.status;
    orm.expiresAt = invitation.expiresAt;
    orm.createdAt = invitation.createdAt;
    orm.updatedAt = invitation.updatedAt;
    return orm;
  }
}
