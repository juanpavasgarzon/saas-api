import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { type Service } from '../../domain/entities/service.entity';

export class ServiceResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000000' })
  tenantId: string;

  @ApiProperty({ example: 'Consultoría técnica' })
  name: string;

  @ApiPropertyOptional({ example: 'Asesoría técnica especializada', nullable: true })
  description: string | null;

  @ApiProperty({ example: 'hora' })
  unit: string;

  @ApiPropertyOptional({ example: 'Tecnología', nullable: true })
  category: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(service: Service) {
    this.id = service.id;
    this.tenantId = service.tenantId;
    this.name = service.name;
    this.description = service.description;
    this.unit = service.unit;
    this.category = service.category;
    this.isActive = service.isActive;
    this.createdAt = service.createdAt;
    this.updatedAt = service.updatedAt;
  }
}
