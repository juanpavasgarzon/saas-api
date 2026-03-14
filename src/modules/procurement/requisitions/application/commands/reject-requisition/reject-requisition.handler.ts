import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IRequisitionRepository } from '../../../domain/contracts/requisition-repository.contract';
import { RequisitionNotFoundError } from '../../../domain/errors/requisition-not-found.error';
import { REQUISITION_REPOSITORY } from '../../../domain/tokens/requisition-repository.token';
import { RejectRequisitionCommand } from './reject-requisition.command';

@CommandHandler(RejectRequisitionCommand)
export class RejectRequisitionHandler implements ICommandHandler<RejectRequisitionCommand, void> {
  constructor(
    @Inject(REQUISITION_REPOSITORY)
    private readonly requisitionRepository: IRequisitionRepository,
  ) {}

  async execute(command: RejectRequisitionCommand): Promise<void> {
    const requisition = await this.requisitionRepository.findById(command.id, command.tenantId);
    if (!requisition) {
      throw new RequisitionNotFoundError(command.id);
    }
    requisition.reject();
    await this.requisitionRepository.save(requisition);
  }
}
