export interface IProspectToVendorService {
  convert(prospectId: string, tenantId: string): Promise<string>;
}
