import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UpdateCustomerDto {
  @ApiProperty({
    example: 'Acme Technologies Inc.',
    minLength: 2,
    description: 'Customer company name',
  })
  @IsString()
  @MinLength(2)
  name!: string;

  @ApiProperty({ example: 'contact@acme.com', description: 'Customer email address' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '+1 555 123 4567', description: 'Contact phone number' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: '100 Main St, New York, NY', description: 'Customer address' })
  @IsString()
  address!: string;

  @ApiProperty({ example: 'Jane Smith', description: 'Primary contact person name' })
  @IsString()
  contactPerson!: string;
}
