import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEmail, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @ApiProperty({
    example: 'John',
    minLength: 2,
    description: 'Employee first name',
  })
  @IsString()
  @MinLength(2)
  firstName!: string;

  @ApiProperty({
    example: 'Doe',
    minLength: 2,
    description: 'Employee last name',
  })
  @IsString()
  @MinLength(2)
  lastName!: string;

  @ApiProperty({
    example: 'john.doe@acme.com',
    description: 'Employee corporate email',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'Backend Developer',
    minLength: 2,
    description: 'Job title or position',
  })
  @IsString()
  @MinLength(2)
  position!: string;

  @ApiProperty({
    example: 'Engineering',
    minLength: 2,
    description: 'Department',
  })
  @IsString()
  @MinLength(2)
  department!: string;

  @ApiProperty({ example: '2024-01-15', description: 'Hire date (YYYY-MM-DD)' })
  @IsDateString()
  hiredAt!: string;

  @ApiProperty({ example: 5000, description: 'Basic monthly salary' })
  @IsNumber()
  @Min(0)
  basicSalary!: number;
}
