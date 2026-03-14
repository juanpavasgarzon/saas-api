import { ApiProperty } from '@nestjs/swagger';

import { type Customer } from '../../domain/entities/customer.entity';

export class CustomerResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Acme Corp' })
  name: string;

  @ApiProperty({ example: 'contact@acme.com' })
  email: string;

  @ApiProperty({ example: '+1 555 000 0000' })
  phone: string;

  @ApiProperty({ example: 'Acme Corporation' })
  company: string | null;

  @ApiProperty({ example: '123456789' })
  identificationNumber: string;

  @ApiProperty({ example: '123 Main St, Springfield' })
  address: string;

  @ApiProperty({ example: 'John Doe' })
  contactPerson: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.name = customer.name;
    this.email = customer.email;
    this.phone = customer.phone;
    this.company = customer.company;
    this.identificationNumber = customer.identificationNumber;
    this.address = customer.address;
    this.contactPerson = customer.contactPerson;
    this.isActive = customer.isActive;
    this.createdAt = customer.createdAt;
    this.updatedAt = customer.updatedAt;
  }
}
