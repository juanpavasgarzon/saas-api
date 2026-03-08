import { ApiProperty } from '@nestjs/swagger';

import { type Sale } from '../../domain/entities/sale.entity';
import { type SaleStatus } from '../../domain/enums/sale-status.enum';
import { SaleItemResponseDto } from './sale-item-response.dto';

export class SaleResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() number: number;
  @ApiProperty() customerId: string;
  @ApiProperty() quotationId: string | null;
  @ApiProperty() status: SaleStatus;
  @ApiProperty() notes: string | null;
  @ApiProperty() subtotal: number;
  @ApiProperty() total: number;
  @ApiProperty({ type: [SaleItemResponseDto] }) items: SaleItemResponseDto[];
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;

  constructor(sale: Sale) {
    this.id = sale.id;
    this.number = sale.number;
    this.customerId = sale.customerId;
    this.quotationId = sale.quotationId;
    this.status = sale.status;
    this.notes = sale.notes;
    this.subtotal = sale.subtotal;
    this.total = sale.total;
    this.items = sale.items.map((i) => new SaleItemResponseDto(i));
    this.createdAt = sale.createdAt;
    this.updatedAt = sale.updatedAt;
  }
}
