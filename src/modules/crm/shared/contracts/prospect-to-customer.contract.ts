export interface IProspectToCustomerService {
  convert(prospectId: string, tenantId: string): Promise<string>;
}
