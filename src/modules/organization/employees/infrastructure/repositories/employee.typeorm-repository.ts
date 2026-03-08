import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { EmployeeFilters } from '../../domain/contracts/employee-filters.contract';
import { EmployeeProps } from '../../domain/contracts/employee-props.contract';
import { EmployeeRepository } from '../../domain/contracts/employee-repository.contract';
import { Employee } from '../../domain/entities/employee.entity';
import { EmployeeOrmEntity } from '../entities/employee.orm-entity';

@Injectable()
export class EmployeeTypeOrmRepository implements EmployeeRepository {
  constructor(
    @InjectRepository(EmployeeOrmEntity)
    private readonly repository: Repository<EmployeeOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Employee | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByEmail(email: string, tenantId: string): Promise<Employee | null> {
    const orm = await this.repository.findOne({
      where: { email: email.toLowerCase().trim(), tenantId },
    });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: EmployeeFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<Employee>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.department) {
      where.department = filters.department;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    if (filters.search) {
      where.firstName = ILike(`%${filters.search}%`);
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

  async save(employee: Employee): Promise<void> {
    await this.repository.save(this.toOrm(employee));
  }

  async delete(id: string, tenantId: string): Promise<void> {
    await this.repository.delete({ id, tenantId });
  }

  async existsByEmail(email: string, tenantId: string): Promise<boolean> {
    return this.repository.exists({
      where: { email: email.toLowerCase().trim(), tenantId },
    });
  }

  private toDomain(orm: EmployeeOrmEntity): Employee {
    const props: EmployeeProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      firstName: orm.firstName,
      lastName: orm.lastName,
      email: orm.email,
      position: orm.position,
      department: orm.department,
      status: orm.status,
      hiredAt: orm.hiredAt,
      basicSalary: Number(orm.basicSalary),
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Employee.reconstitute(props);
  }

  private toOrm(employee: Employee): EmployeeOrmEntity {
    const orm = new EmployeeOrmEntity();
    orm.id = employee.id;
    orm.tenantId = employee.tenantId;
    orm.firstName = employee.firstName;
    orm.lastName = employee.lastName;
    orm.email = employee.email;
    orm.position = employee.position;
    orm.department = employee.department;
    orm.status = employee.status;
    orm.hiredAt = employee.hiredAt;
    orm.basicSalary = employee.basicSalary;
    return orm;
  }
}
