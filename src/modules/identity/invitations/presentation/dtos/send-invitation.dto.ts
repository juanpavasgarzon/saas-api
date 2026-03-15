import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsUrl } from 'class-validator';

import { UserRole } from '@core/domain/enums/user-role.enum';

export class SendInvitationDto {
  @ApiProperty({
    example: 'newuser@acme.com',
    description: 'Email address of the user to invite',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Role the user will receive upon accepting',
  })
  @IsEnum(UserRole)
  role!: UserRole;

  @ApiProperty({
    example: 'https://app.example.com/accept-invitation',
    description: 'Base URL for the invitation acceptance link',
  })
  @IsUrl()
  url!: string;
}
