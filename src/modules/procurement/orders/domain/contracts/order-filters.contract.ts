import { type OrderStatus } from '../enums/order-status.enum';

export interface OrderFilters {
  status?: OrderStatus;
  supplierId?: string;
}
