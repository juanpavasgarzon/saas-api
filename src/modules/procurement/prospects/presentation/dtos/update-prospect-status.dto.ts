import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { VendorProspectStatus } from '../../domain/enums/prospect-status.enum';

export class UpdateVendorProspectStatusDto {
  @ApiProperty({ enum: VendorProspectStatus })
  @IsEnum(VendorProspectStatus)
  status!: VendorProspectStatus;
}
