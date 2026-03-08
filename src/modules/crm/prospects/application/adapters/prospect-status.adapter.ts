import { Inject, Injectable } from '@nestjs/common';

import { type IProspectStatusService } from '@modules/crm/shared/contracts/prospect-status.contract';

import { type IProspectRepository } from '../../domain/contracts/prospect-repository.contract';
import { type ProspectStatus } from '../../domain/enums/prospect-status.enum';
import { PROSPECT_REPOSITORY } from '../../domain/tokens/prospect-repository.token';

@Injectable()
export class ProspectStatusAdapter implements IProspectStatusService {
  constructor(
    @Inject(PROSPECT_REPOSITORY)
    private readonly prospectRepository: IProspectRepository,
  ) {}

  async getStatus(prospectId: string, tenantId: string): Promise<ProspectStatus | null> {
    const prospect = await this.prospectRepository.findById(prospectId, tenantId);
    return prospect?.status ?? null;
  }
}
