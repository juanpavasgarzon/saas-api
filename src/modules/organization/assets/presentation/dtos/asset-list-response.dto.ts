import { ApiProperty } from '@nestjs/swagger';

import { type Asset } from '../../domain/entities/asset.entity';
import { type AssetCategory } from '../../domain/enums/asset-category.enum';
import { type AssetStatus } from '../../domain/enums/asset-status.enum';

export class AssetListResponseDto {
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
    this.createdAt = asset.createdAt;
    this.updatedAt = asset.updatedAt;
  }
}
