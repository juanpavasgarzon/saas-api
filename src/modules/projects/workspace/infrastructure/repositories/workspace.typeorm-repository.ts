import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import { type WorkspaceFilters } from '../../domain/contracts/workspace-filters.contract';
import { type IWorkspaceRepository } from '../../domain/contracts/workspace-repository.contract';
import { Workspace } from '../../domain/entities/workspace.entity';
import { WorkspaceMember } from '../../domain/entities/workspace-member.entity';
import { WorkspaceOrmEntity } from '../entities/workspace.orm-entity';
import { WorkspaceMemberOrmEntity } from '../entities/workspace-member.orm-entity';

@Injectable()
export class WorkspaceTypeOrmRepository implements IWorkspaceRepository {
  constructor(
    @InjectRepository(WorkspaceOrmEntity)
    private readonly repository: Repository<WorkspaceOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Workspace | null> {
    const orm = await this.repository.findOne({
      where: { id, tenantId },
      relations: ['members'],
    });

    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: WorkspaceFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Workspace>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.customerId) {
      where.customerId = filters.customerId;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.name = ILike(`%${filters.search}%`);
    }

    const [items, total] = await this.repository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async save(project: Workspace): Promise<void> {
    await this.repository.save(this.toOrm(project));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  private toDomain(orm: WorkspaceOrmEntity): Workspace {
    const members = (orm.members ?? []).map((m) => this.memberToDomain(m));

    return Workspace.reconstitute({
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      description: orm.description,
      customerId: orm.customerId,
      status: orm.status,
      budget: orm.budget,
      startDate: orm.startDate,
      endDate: orm.endDate,
      members,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    });
  }

  private memberToDomain(orm: WorkspaceMemberOrmEntity): WorkspaceMember {
    return WorkspaceMember.reconstitute({
      id: orm.id,
      workspaceId: orm.workspaceId,
      tenantId: orm.tenantId,
      employeeId: orm.employeeId,
      role: orm.role,
      joinedAt: orm.joinedAt,
    });
  }

  private toOrm(project: Workspace): WorkspaceOrmEntity {
    const orm = new WorkspaceOrmEntity();
    orm.id = project.id;
    orm.tenantId = project.tenantId;
    orm.name = project.name;
    orm.description = project.description;
    orm.customerId = project.customerId;
    orm.status = project.status;
    orm.budget = project.budget;
    orm.startDate = project.startDate;
    orm.endDate = project.endDate;
    orm.members = project.members.map((m) => this.memberToOrm(m));

    return orm;
  }

  private memberToOrm(member: WorkspaceMember): WorkspaceMemberOrmEntity {
    const orm = new WorkspaceMemberOrmEntity();
    orm.id = member.id;
    orm.workspaceId = member.workspaceId;
    orm.tenantId = member.tenantId;
    orm.employeeId = member.employeeId;
    orm.role = member.role;
    orm.joinedAt = member.joinedAt;

    return orm;
  }
}
