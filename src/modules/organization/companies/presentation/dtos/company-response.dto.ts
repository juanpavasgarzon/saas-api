import { ApiProperty } from '@nestjs/swagger';

import { type Company } from '../../domain/entities/company.entity';
import { CompanyPlan } from '../../domain/enums/company-plan.enum';

export class CompanyResponseDto {
  @ApiProperty({ example: '019542ab-1234-7abc-8def-000000000001' })
  id: string;

  @ApiProperty({ example: 'Acme Corp' })
  name: string;

  @ApiProperty({ example: 'acme-corp' })
  slug: string;

  @ApiProperty({ enum: CompanyPlan, example: CompanyPlan.STARTER })
  plan: CompanyPlan;

  @ApiProperty({ example: 'https://example.com/logo.png', nullable: true })
  logo: string | null;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2025-01-01T00:00:00.000Z' })
  updatedAt: Date;

  constructor(company: Company) {
    this.id = company.id;
    this.name = company.name;
    this.slug = company.slug;
    this.plan = company.plan;
    this.logo = company.logo;
    this.isActive = company.isActive;
    this.createdAt = company.createdAt;
    this.updatedAt = company.updatedAt;
  }
}
