import { Inject } from '@nestjs/common';
import { CommandHandler, type ICommandHandler } from '@nestjs/cqrs';

import { type IRequisitionRepository } from '../../../domain/contracts/requisition-repository.contract';
import { RequisitionNotFoundError } from '../../../domain/errors/requisition-not-found.error';
import { REQUISITION_REPOSITORY } from '../../../domain/tokens/requisition-repository.token';
import { SubmitRequisitionCommand } from './submit-requisition.command';

@CommandHandler(SubmitRequisitionCommand)
export class SubmitRequisitionHandler implements ICommandHandler<SubmitRequisitionCommand, void> {
  constructor(
    @Inject(REQUISITION_REPOSITORY)
    private readonly requisitionRepository: IRequisitionRepository,
  ) {}

  async execute(command: SubmitRequisitionCommand): Promise<void> {
    const requisition = await this.requisitionRepository.findById(command.id, command.tenantId);
    if (!requisition) {
      throw new RequisitionNotFoundError(command.id);
    }
    requisition.submit();
    await this.requisitionRepository.save(requisition);
  }
}
