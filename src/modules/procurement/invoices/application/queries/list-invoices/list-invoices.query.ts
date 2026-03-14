import { type InvoiceStatus } from '../../../domain/enums/invoice-status.enum';

export class ListInvoicesQuery {
  constructor(
    public readonly tenantId: string,
    public readonly status: InvoiceStatus | undefined,
    public readonly supplierId: string | undefined,
    public readonly orderId: string | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
