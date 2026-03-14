import { Inject } from '@nestjs/common';
import { CommandHandler, EventPublisher, type ICommandHandler } from '@nestjs/cqrs';

import { type IRequisitionRepository } from '../../../domain/contracts/requisition-repository.contract';
import { RequisitionNotFoundError } from '../../../domain/errors/requisition-not-found.error';
import { REQUISITION_REPOSITORY } from '../../../domain/tokens/requisition-repository.token';
import { ApproveRequisitionCommand } from './approve-requisition.command';

@CommandHandler(ApproveRequisitionCommand)
export class ApproveRequisitionHandler implements ICommandHandler<ApproveRequisitionCommand, void> {
  constructor(
    @Inject(REQUISITION_REPOSITORY)
    private readonly requisitionRepository: IRequisitionRepository,
    private readonly publisher: EventPublisher,
  ) {}

  async execute(command: ApproveRequisitionCommand): Promise<void> {
    const requisition = await this.requisitionRepository.findById(command.id, command.tenantId);
    if (!requisition) {
      throw new RequisitionNotFoundError(command.id);
    }
    this.publisher.mergeObjectContext(requisition);
    requisition.approve();
    await this.requisitionRepository.save(requisition);
    requisition.commit();
  }
}
