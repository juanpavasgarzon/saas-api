import { type OrderStatus } from '../../../domain/enums/order-status.enum';

export class ListOrdersQuery {
  constructor(
    public readonly tenantId: string,
    public readonly status: OrderStatus | undefined,
    public readonly supplierId: string | undefined,
    public readonly page: number,
    public readonly limit: number,
  ) {}
}
