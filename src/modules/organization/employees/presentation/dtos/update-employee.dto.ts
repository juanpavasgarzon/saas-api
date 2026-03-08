import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNumber, IsString, Min, MinLength } from 'class-validator';

export class UpdateEmployeeDto {
  @ApiProperty({ example: 'John', minLength: 2, description: 'Employee first name' })
  @IsString()
  @MinLength(2)
  firstName!: string;

  @ApiProperty({ example: 'Doe', minLength: 2, description: 'Employee last name' })
  @IsString()
  @MinLength(2)
  lastName!: string;

  @ApiProperty({ example: 'john.doe@acme.com', description: 'Employee work email' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Senior Developer', minLength: 2, description: 'Job title or position' })
  @IsString()
  @MinLength(2)
  position!: string;

  @ApiProperty({ example: 'Engineering', minLength: 2, description: 'Department' })
  @IsString()
  @MinLength(2)
  department!: string;

  @ApiProperty({ example: 5500 })
  @IsNumber()
  @Min(0)
  basicSalary!: number;
}
