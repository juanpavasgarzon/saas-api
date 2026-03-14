export interface ICompanyCreationService {
  createCompany(name: string): Promise<string>;
}
