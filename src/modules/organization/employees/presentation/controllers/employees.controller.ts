import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';
import { Permission } from '@core/domain/enums/permission.enum';
import { CurrentTenant } from '@core/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@core/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@core/presentation/dtos/created-response.dto';

import { CreateEmployeeCommand } from '../../application/commands/create-employee/create-employee.command';
import { DeactivateEmployeeCommand } from '../../application/commands/deactivate-employee/deactivate-employee.command';
import { ReactivateEmployeeCommand } from '../../application/commands/reactivate-employee/reactivate-employee.command';
import { UpdateEmployeeCommand } from '../../application/commands/update-employee/update-employee.command';
import { GetEmployeeQuery } from '../../application/queries/get-employee/get-employee.query';
import { ListEmployeesQuery } from '../../application/queries/list-employees/list-employees.query';
import { type Employee } from '../../domain/entities/employee.entity';
import { CreateEmployeeDto } from '../dtos/create-employee.dto';
import { EmployeeResponseDto } from '../dtos/employee-response.dto';
import { ListEmployeesDto } from '../dtos/list-employees.dto';
import { UpdateEmployeeDto } from '../dtos/update-employee.dto';

@ApiTags('Organization')
@ApiBearerAuth('JWT')
@Controller('organization/employees')
export class EmployeesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.OrganizationEmployeesCreate)
  @ApiOperation({ summary: 'Create employee', description: 'Registers a new employee.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createEmployee(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateEmployeeDto,
  ): Promise<CreatedResponseDto> {
    const createEmployeeCommand = new CreateEmployeeCommand(
      tenantId,
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.position,
      dto.department,
      new Date(dto.hiredAt),
      dto.basicSalary,
    );
    const id = await this.commandBus.execute<CreateEmployeeCommand, string>(createEmployeeCommand);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.OrganizationEmployeesRead)
  @ApiOperation({ summary: 'List employees', description: 'Returns employees with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of employees' })
  @ApiQuery({ name: 'department', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'ON_LEAVE'] })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listEmployees(
    @CurrentTenant() tenantId: string,
    @Query() query: ListEmployeesDto,
  ): Promise<PaginatedResult<EmployeeResponseDto>> {
    const filters = { department: query.department, status: query.status, search: query.search };
    const listEmployeesQuery = new ListEmployeesQuery(tenantId, filters, query.page, query.limit);
    const result = await this.queryBus.execute<ListEmployeesQuery, PaginatedResult<Employee>>(
      listEmployeesQuery,
    );
    return {
      ...result,
      items: result.items.map((e) => new EmployeeResponseDto(e)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.OrganizationEmployeesRead)
  @ApiOperation({ summary: 'Get employee', description: 'Returns employee data by ID.' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async getEmployee(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    const getEmployeeQuery = new GetEmployeeQuery(id, tenantId);
    const employee = await this.queryBus.execute<GetEmployeeQuery, Employee>(getEmployeeQuery);
    return new EmployeeResponseDto(employee);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationEmployeesModify)
  @ApiOperation({ summary: 'Update employee', description: 'Updates employee data.' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiNoContentResponse({ description: 'Employee updated' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  async updateEmployee(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateEmployeeDto,
  ): Promise<void> {
    const updateEmployeeCommand = new UpdateEmployeeCommand(
      tenantId,
      id,
      dto.firstName,
      dto.lastName,
      dto.email,
      dto.position,
      dto.department,
      dto.basicSalary,
    );
    await this.commandBus.execute(updateEmployeeCommand);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationEmployeesModify)
  @ApiOperation({
    summary: 'Reactivate employee',
    description: 'Reactivates an inactive employee.',
  })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiNoContentResponse({ description: 'Employee reactivated' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiConflictResponse({ description: 'Employee is already active' })
  async reactivateEmployee(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ReactivateEmployeeCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationEmployeesRemove)
  @ApiOperation({ summary: 'Deactivate employee', description: 'Marks employee as inactive.' })
  @ApiParam({ name: 'id', description: 'Employee UUID' })
  @ApiNoContentResponse({ description: 'Employee deactivated' })
  @ApiNotFoundResponse({ description: 'Employee not found' })
  @ApiConflictResponse({ description: 'Employee is already inactive' })
  async deactivateEmployee(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const deactivateEmployeeCommand = new DeactivateEmployeeCommand(id, tenantId);
    await this.commandBus.execute(deactivateEmployeeCommand);
  }
}
