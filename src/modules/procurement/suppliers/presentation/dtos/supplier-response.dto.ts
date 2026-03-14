import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Supplier } from '../../domain/entities/supplier.entity';

export class SupplierResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Acme Supplies Ltd.' })
  name: string;

  @ApiProperty({ example: 'contact@acme.com' })
  email: string;

  @ApiPropertyOptional({ example: 'Acme Corporation', nullable: true })
  company: string | null;

  @ApiProperty({ example: '123456789' })
  identificationNumber: string;

  @ApiProperty({ example: '+1-555-000-1234' })
  phone: string;

  @ApiProperty({ example: '123 Industrial Ave, Suite 4' })
  address: string;

  @ApiProperty({ example: 'John Smith' })
  contactPerson: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(supplier: Supplier) {
    this.id = supplier.id;
    this.name = supplier.name;
    this.email = supplier.email;
    this.company = supplier.company;
    this.identificationNumber = supplier.identificationNumber;
    this.phone = supplier.phone;
    this.address = supplier.address;
    this.contactPerson = supplier.contactPerson;
    this.isActive = supplier.isActive;
    this.createdAt = supplier.createdAt;
    this.updatedAt = supplier.updatedAt;
  }
}
