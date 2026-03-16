import { Inject, Injectable } from '@nestjs/common';

import { type ILineItemTypeAdapter } from '@core/application/contracts/line-item-type-adapter.contract';

import { type IServiceRepository } from '../../domain/contracts/service-repository.contract';
import { SERVICE_REPOSITORY } from '../../domain/tokens/service-repository.token';

@Injectable()
export class ServiceLineItemAdapter implements ILineItemTypeAdapter {
  constructor(
    @Inject(SERVICE_REPOSITORY)
    private readonly serviceRepository: IServiceRepository,
  ) {}

  findExistingIds(ids: string[], tenantId: string): Promise<string[]> {
    return this.serviceRepository.findExistingIds(ids, tenantId);
  }
}
