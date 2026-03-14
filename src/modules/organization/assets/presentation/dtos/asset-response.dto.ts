import { ApiProperty } from '@nestjs/swagger';

import { type Asset } from '../../domain/entities/asset.entity';
import { AssetCategory } from '../../domain/enums/asset-category.enum';
import { AssetStatus } from '../../domain/enums/asset-status.enum';
import { AssetAssignmentResponseDto } from './asset-assignment-response.dto';

export class AssetResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 3001 })
  number: number;

  @ApiProperty({ example: 'Dell Latitude 5520' })
  name: string;

  @ApiProperty({ enum: AssetCategory, example: AssetCategory.EQUIPMENT })
  category: AssetCategory;

  @ApiProperty({ example: 'SN-123456789', nullable: true })
  serialNumber: string | null;

  @ApiProperty({ example: 'Company laptop for engineering team', nullable: true })
  description: string | null;

  @ApiProperty({ enum: AssetStatus, example: AssetStatus.ACTIVE })
  status: AssetStatus;

  @ApiProperty({ example: '2023-06-01T00:00:00.000Z', nullable: true })
  purchaseDate: Date | null;

  @ApiProperty({ example: 1200.0, nullable: true })
  purchaseValue: number | null;

  @ApiProperty({ type: [AssetAssignmentResponseDto] })
  assignments: AssetAssignmentResponseDto[];

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  updatedAt: Date;

  constructor(asset: Asset) {
    this.id = asset.id;
    this.number = asset.number;
    this.name = asset.name;
    this.category = asset.category;
    this.serialNumber = asset.serialNumber;
    this.description = asset.description;
    this.status = asset.status;
    this.purchaseDate = asset.purchaseDate;
    this.purchaseValue = asset.purchaseValue;
    this.assignments = asset.assignments.map((a) => new AssetAssignmentResponseDto(a));
    this.createdAt = asset.createdAt;
    this.updatedAt = asset.updatedAt;
  }
}
