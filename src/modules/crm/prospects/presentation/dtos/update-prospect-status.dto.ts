import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { ProspectStatus } from '../../domain/enums/prospect-status.enum';

export class UpdateProspectStatusDto {
  @ApiProperty({ enum: ProspectStatus })
  @IsEnum(ProspectStatus)
  status!: ProspectStatus;
}
