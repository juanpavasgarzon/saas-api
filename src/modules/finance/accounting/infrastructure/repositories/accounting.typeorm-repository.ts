import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, type FindOptionsWhere, Repository } from 'typeorm';

import { PaginatedResult } from '@core/domain/contracts/paginated-result.contract';

import {
  type IAccountingRepository,
  type TransactionFilters,
} from '../../domain/contracts/accounting-repository.contract';
import { AccountingTransactionProps } from '../../domain/contracts/accounting-transaction-props.contract';
import { AccountingTransaction } from '../../domain/entities/accounting-transaction.entity';
import { TransactionType } from '../../domain/enums/transaction-type.enum';
import { AccountingTransactionOrmEntity } from '../entities/accounting-transaction.orm-entity';

@Injectable()
export class AccountingTypeOrmRepository implements IAccountingRepository {
  constructor(
    @InjectRepository(AccountingTransactionOrmEntity)
    private readonly repo: Repository<AccountingTransactionOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<AccountingTransaction | null> {
    const orm = await this.repo.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(
    tenantId: string,
    filters: TransactionFilters,
    page: number,
    limit: number,
  ): Promise<PaginatedResult<AccountingTransaction>> {
    const where: FindOptionsWhere<AccountingTransactionOrmEntity> = {
      tenantId,
    };
    if (filters.type) {
      where.type = filters.type as TransactionType;
    }
    if (filters.dateFrom && filters.dateTo) {
      where.date = Between(new Date(filters.dateFrom), new Date(filters.dateTo));
    }

    const [items, total] = await this.repo.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { date: 'DESC' },
    });

    return {
      items: items.map((item) => this.toDomain(item)),
      total,
      page,
      limit,
    };
  }

  async save(transaction: AccountingTransaction): Promise<void> {
    await this.repo.save(this.toOrm(transaction));
  }

  private toDomain(orm: AccountingTransactionOrmEntity): AccountingTransaction {
    const props: AccountingTransactionProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      type: orm.type,
      amount: Number(orm.amount),
      description: orm.description,
      reference: orm.reference,
      date: orm.date,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return AccountingTransaction.reconstitute(props);
  }

  private toOrm(transaction: AccountingTransaction): AccountingTransactionOrmEntity {
    const orm = new AccountingTransactionOrmEntity();
    orm.id = transaction.id;
    orm.tenantId = transaction.tenantId;
    orm.type = transaction.type;
    orm.amount = transaction.amount;
    orm.description = transaction.description;
    orm.reference = transaction.reference;
    orm.date = transaction.date;
    return orm;
  }
}
