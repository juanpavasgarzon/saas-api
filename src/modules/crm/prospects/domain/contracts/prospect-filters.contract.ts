import { type ProspectStatus } from '../enums/prospect-status.enum';

export interface ProspectFilters {
  status?: ProspectStatus;
  search?: string;
}
