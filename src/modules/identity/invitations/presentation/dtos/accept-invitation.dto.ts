import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class AcceptInvitationDto {
  @ApiProperty({
    example: 'Password123!',
    minLength: 8,
    description: 'Password for the new account',
  })
  @IsString()
  @MinLength(8)
  password!: string;
}
