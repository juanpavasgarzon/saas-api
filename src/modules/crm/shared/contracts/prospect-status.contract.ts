import { type ProspectStatus } from '@modules/crm/prospects/domain/enums/prospect-status.enum';

export interface IProspectStatusService {
  getStatus(prospectId: string, tenantId: string): Promise<ProspectStatus | null>;
}
