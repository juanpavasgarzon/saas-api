import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Prospect } from '../../domain/entities/prospect.entity';
import { ProspectSource } from '../../domain/enums/prospect-source.enum';
import { ProspectStatus } from '../../domain/enums/prospect-status.enum';

export class ProspectResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Jane Doe' })
  name: string;

  @ApiPropertyOptional({ example: 'jane@example.com', nullable: true })
  email: string | null;

  @ApiPropertyOptional({ example: '+1 555 000 0000', nullable: true })
  phone: string | null;

  @ApiPropertyOptional({ example: 'Acme Corp', nullable: true })
  company: string | null;

  @ApiPropertyOptional({ enum: ProspectSource, nullable: true })
  source: ProspectSource | null;

  @ApiProperty({ enum: ProspectStatus, example: ProspectStatus.NEW })
  status: ProspectStatus;

  @ApiPropertyOptional({ example: 'Interested in enterprise plan', nullable: true })
  notes: string | null;

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
    this.source = prospect.source;
    this.status = prospect.status;
    this.notes = prospect.notes;
    this.createdAt = prospect.createdAt;
    this.updatedAt = prospect.updatedAt;
  }
}
