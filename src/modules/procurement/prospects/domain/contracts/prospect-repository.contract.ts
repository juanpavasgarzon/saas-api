import { type Prospect } from '../entities/prospect.entity';

export interface IProspectRepository {
  findById(id: string, tenantId: string): Promise<Prospect | null>;
  save(prospect: Prospect): Promise<void>;
}
