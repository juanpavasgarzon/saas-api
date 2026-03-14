export interface CompanyProfile {
  name: string;
  logo: string | null;
}

export interface ICompanyProfileService {
  getProfile(tenantId: string): Promise<CompanyProfile>;
}
