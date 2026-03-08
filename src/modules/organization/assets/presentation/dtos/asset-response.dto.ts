import { ApiProperty } from '@nestjs/swagger';

import { type Asset } from '../../domain/entities/asset.entity';
import { type AssetCategory } from '../../domain/enums/asset-category.enum';
import { type AssetStatus } from '../../domain/enums/asset-status.enum';
import { AssetAssignmentResponseDto } from './asset-assignment-response.dto';

export class AssetResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  number: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  category: AssetCategory;

  @ApiProperty({ nullable: true })
  serialNumber: string | null;

  @ApiProperty({ nullable: true })
  description: string | null;

  @ApiProperty()
  status: AssetStatus;

  @ApiProperty({ nullable: true })
  purchaseDate: Date | null;

  @ApiProperty({ nullable: true })
  purchaseValue: number | null;

  @ApiProperty({ type: [AssetAssignmentResponseDto] })
  assignments: AssetAssignmentResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
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
