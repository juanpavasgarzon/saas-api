import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';

import { PayrollEntryProps } from '../../domain/contracts/payroll-entry-props.contract';
import {
  IPayrollRepository,
  PayrollFilters,
} from '../../domain/contracts/payroll-repository.contract';
import { PayrollEntry } from '../../domain/entities/payroll-entry.entity';
import { PayrollEntryOrmEntity } from '../entities/payroll-entry.orm-entity';

@Injectable()
export class PayrollTypeOrmRepository implements IPayrollRepository {
  constructor(
    @InjectRepository(PayrollEntryOrmEntity)
    private readonly repo: Repository<PayrollEntryOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<PayrollEntry | null> {
    const orm = await this.repo.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: PayrollFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<PayrollEntry>> {
    const where: Record<string, unknown> = { tenantId };
    if (filters.employeeId) {
      where.employeeId = filters.employeeId;
    }
    if (filters.period) {
      where.period = filters.period;
    }
    if (filters.status) {
      where.status = filters.status;
    }

    const [items, total] = await this.repo.findAndCount({
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

  async save(entry: PayrollEntry): Promise<void> {
    await this.repo.save(this.toOrm(entry));
  }

  private toDomain(orm: PayrollEntryOrmEntity): PayrollEntry {
    const props: PayrollEntryProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      employeeId: orm.employeeId,
      period: orm.period,
      daysWorked: Number(orm.daysWorked),
      baseSalary: Number(orm.baseSalary),
      bonuses: Number(orm.bonuses),
      deductions: Number(orm.deductions),
      netPay: Number(orm.netPay),
      status: orm.status,
      paidAt: orm.paidAt,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return PayrollEntry.reconstitute(props);
  }

  private toOrm(entry: PayrollEntry): PayrollEntryOrmEntity {
    const orm = new PayrollEntryOrmEntity();
    orm.id = entry.id;
    orm.tenantId = entry.tenantId;
    orm.employeeId = entry.employeeId;
    orm.period = entry.period;
    orm.daysWorked = entry.daysWorked;
    orm.baseSalary = entry.baseSalary;
    orm.bonuses = entry.bonuses;
    orm.deductions = entry.deductions;
    orm.netPay = entry.netPay;
    orm.status = entry.status;
    orm.paidAt = entry.paidAt;
    return orm;
  }
}
