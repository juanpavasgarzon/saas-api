import { type QuotationStatus } from '../enums/quotation-status.enum';

export interface QuotationFilters {
  status?: QuotationStatus;
  customerId?: string;
  prospectId?: string;
}
