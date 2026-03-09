export interface ICompanyLogoService {
  prepareLogoBase64(file: Express.Multer.File): Promise<string>;
}
