export interface IQuotationEmailService {
  sendWithPdf(
    to: string,
    quotationNumber: string,
    pdfBuffer: Buffer,
    filename: string,
  ): Promise<void>;
}
