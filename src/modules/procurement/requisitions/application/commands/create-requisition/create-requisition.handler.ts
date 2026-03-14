import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IRequisitionRepository } from '../../../domain/contracts/requisition-repository.contract';
import { Requisition } from '../../../domain/entities/requisition.entity';
import { REQUISITION_REPOSITORY } from '../../../domain/tokens/requisition-repository.token';
import { CreateRequisitionCommand } from './create-requisition.command';

@CommandHandler(CreateRequisitionCommand)
export class CreateRequisitionHandler implements ICommandHandler<CreateRequisitionCommand, string> {
  constructor(
    @Inject(REQUISITION_REPOSITORY)
    private readonly requisitionRepository: IRequisitionRepository,
  ) {}

  async execute(command: CreateRequisitionCommand): Promise<string> {
    const requisition = Requisition.create(
      command.tenantId,
      command.title,
      command.supplierId,
      command.supplierProspectId,
      command.notes,
      command.items,
    );
    await this.requisitionRepository.save(requisition);
    return requisition.id;
  }
}
