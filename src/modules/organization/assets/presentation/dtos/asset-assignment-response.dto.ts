import { ApiProperty } from '@nestjs/swagger';

import { type AssetAssignment } from '../../domain/entities/asset-assignment.entity';

export class AssetAssignmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  assetId: string;

  @ApiProperty({ nullable: true })
  projectId: string | null;

  @ApiProperty({ nullable: true })
  employeeId: string | null;

  @ApiProperty()
  assignedAt: Date;

  @ApiProperty({ nullable: true })
  returnedAt: Date | null;

  constructor(a: AssetAssignment) {
    this.id = a.id;
    this.assetId = a.assetId;
    this.projectId = a.projectId;
    this.employeeId = a.employeeId;
    this.assignedAt = a.assignedAt;
    this.returnedAt = a.returnedAt;
  }
}
