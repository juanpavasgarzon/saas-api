import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { type ProjectFilters } from '../../domain/contracts/project-filters.contract';
import { type ProjectRepository } from '../../domain/contracts/project-repository.contract';
import { Project } from '../../domain/entities/project.entity';
import { ProjectMember } from '../../domain/entities/project-member.entity';
import { ProjectOrmEntity } from '../entities/project.orm-entity';
import { ProjectMemberOrmEntity } from '../entities/project-member.orm-entity';

@Injectable()
export class ProjectTypeOrmRepository implements ProjectRepository {
  constructor(
    @InjectRepository(ProjectOrmEntity)
    private readonly repository: Repository<ProjectOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Project | null> {
    const orm = await this.repository.findOne({
      where: { id, tenantId },
      relations: ['members'],
    });

    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: ProjectFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Project>> {
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
      relations: ['members'],
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

  async save(project: Project): Promise<void> {
    await this.repository.save(this.toOrm(project));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  private toDomain(orm: ProjectOrmEntity): Project {
    const members = (orm.members ?? []).map((m) => this.memberToDomain(m));

    return Project.reconstitute({
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

  private memberToDomain(orm: ProjectMemberOrmEntity): ProjectMember {
    return ProjectMember.reconstitute({
      id: orm.id,
      projectId: orm.projectId,
      tenantId: orm.tenantId,
      employeeId: orm.employeeId,
      role: orm.role,
      joinedAt: orm.joinedAt,
    });
  }

  private toOrm(project: Project): ProjectOrmEntity {
    const orm = new ProjectOrmEntity();
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

  private memberToOrm(member: ProjectMember): ProjectMemberOrmEntity {
    const orm = new ProjectMemberOrmEntity();
    orm.id = member.id;
    orm.projectId = member.projectId;
    orm.tenantId = member.tenantId;
    orm.employeeId = member.employeeId;
    orm.role = member.role;
    orm.joinedAt = member.joinedAt;

    return orm;
  }
}
