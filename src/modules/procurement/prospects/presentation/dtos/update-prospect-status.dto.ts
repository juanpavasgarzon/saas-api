import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { SupplierProspectStatus } from '../../domain/enums/prospect-status.enum';

export class UpdateSupplierProspectStatusDto {
  @ApiProperty({ enum: SupplierProspectStatus })
  @IsEnum(SupplierProspectStatus)
  status!: SupplierProspectStatus;
}
