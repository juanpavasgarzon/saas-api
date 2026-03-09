import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { type IProspectProps } from '@modules/procurement/prospects/domain/contracts/prospect-props.contract';
import { type IProspectRepository } from '@modules/procurement/prospects/domain/contracts/prospect-repository.contract';
import { Prospect } from '@modules/procurement/prospects/domain/entities/prospect.entity';

import { ProspectOrmEntity } from '../entities/prospect.orm-entity';

@Injectable()
export class ProspectTypeOrmRepository implements IProspectRepository {
  constructor(
    @InjectRepository(ProspectOrmEntity)
    private readonly repository: Repository<ProspectOrmEntity>,
  ) {}

  async findById(id: string, tenantId: string): Promise<Prospect | null> {
    const orm = await this.repository.findOne({ where: { id, tenantId } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(prospect: Prospect): Promise<void> {
    await this.repository.save(this.toOrm(prospect));
  }

  private toDomain(orm: ProspectOrmEntity): Prospect {
    const props: IProspectProps = {
      id: orm.id,
      tenantId: orm.tenantId,
      name: orm.name,
      email: orm.email,
      phone: orm.phone,
      company: orm.company,
      notes: orm.notes,
      status: orm.status,
      createdAt: orm.createdAt,
      updatedAt: orm.updatedAt,
    };
    return Prospect.reconstitute(props);
  }

  private toOrm(prospect: Prospect): ProspectOrmEntity {
    const orm = new ProspectOrmEntity();
    orm.id = prospect.id;
    orm.tenantId = prospect.tenantId;
    orm.name = prospect.name;
    orm.email = prospect.email;
    orm.phone = prospect.phone;
    orm.company = prospect.company;
    orm.notes = prospect.notes;
    orm.status = prospect.status;
    return orm;
  }
}
