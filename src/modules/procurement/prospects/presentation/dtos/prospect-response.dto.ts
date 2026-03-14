import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Prospect } from '../../domain/entities/prospect.entity';
import { VendorProspectStatus } from '../../domain/enums/prospect-status.enum';

export class VendorProspectResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Tech Parts Co.' })
  name: string;

  @ApiPropertyOptional({ example: 'info@techparts.com', nullable: true })
  email: string | null;

  @ApiPropertyOptional({ example: '+1-555-000-9876', nullable: true })
  phone: string | null;

  @ApiPropertyOptional({ example: 'Tech Parts Co.', nullable: true })
  company: string | null;

  @ApiPropertyOptional({ example: '123456789', nullable: true })
  identificationNumber: string | null;

  @ApiPropertyOptional({ example: '100 Industrial Ave', nullable: true })
  address: string | null;

  @ApiPropertyOptional({ example: 'John Smith', nullable: true })
  contactPerson: string | null;

  @ApiPropertyOptional({ example: 'Referred by procurement team.', nullable: true })
  notes: string | null;

  @ApiProperty({ enum: VendorProspectStatus, example: VendorProspectStatus.NEW })
  status: VendorProspectStatus;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(prospect: Prospect) {
    this.id = prospect.id;
    this.name = prospect.name;
    this.email = prospect.email;
    this.phone = prospect.phone;
    this.company = prospect.company;
    this.identificationNumber = prospect.identificationNumber;
    this.address = prospect.address;
    this.contactPerson = prospect.contactPerson;
    this.notes = prospect.notes;
    this.status = prospect.status;
    this.createdAt = prospect.createdAt;
    this.updatedAt = prospect.updatedAt;
  }
}
