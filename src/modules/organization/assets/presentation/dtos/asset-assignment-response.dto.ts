import { ApiProperty } from '@nestjs/swagger';

import { type AssetAssignment } from '../../domain/entities/asset-assignment.entity';

export class AssetAssignmentResponseDto {
  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  id: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' })
  assetId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', nullable: true })
  projectId: string | null;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890', nullable: true })
  employeeId: string | null;

  @ApiProperty({ example: '2024-01-15T10:00:00.000Z' })
  assignedAt: Date;

  @ApiProperty({ example: '2024-03-01T10:00:00.000Z', nullable: true })
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
