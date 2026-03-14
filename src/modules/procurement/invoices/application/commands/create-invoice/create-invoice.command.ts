export class CreateInvoiceCommand {
  constructor(
    public readonly tenantId: string,
    public readonly invoiceNumber: string,
    public readonly supplierId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly dueDate: Date | null,
    public readonly notes: string | null,
  ) {}
}
