import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@shared/presentation/dtos/created-response.dto';

import { CreateCustomerCommand } from '../../application/commands/create-customer/create-customer.command';
import { ReactivateCustomerCommand } from '../../application/commands/reactivate-customer/reactivate-customer.command';
import { DeactivateCustomerCommand } from '../../application/commands/update-customer/deactivate-customer.command';
import { UpdateCustomerCommand } from '../../application/commands/update-customer/update-customer.command';
import { GetCustomerQuery } from '../../application/queries/get-customer/get-customer.query';
import { ListCustomersQuery } from '../../application/queries/list-customers/list-customers.query';
import { type Customer } from '../../domain/entities/customer.entity';
import { CreateCustomerDto } from '../dtos/create-customer.dto';
import { CustomerResponseDto } from '../dtos/customer-response.dto';
import { UpdateCustomerDto } from '../dtos/update-customer.dto';

@ApiTags('CRM')
@ApiBearerAuth('JWT')
@Controller('crm/customers')
export class CustomersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.CrmCustomersCreate)
  @ApiOperation({ summary: 'Create customer', description: 'Registers a new customer.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createCustomer(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateCustomerDto,
  ): Promise<CreatedResponseDto> {
    const createCustomerCommand = new CreateCustomerCommand(
      tenantId,
      dto.name,
      dto.email,
      dto.phone,
      dto.address,
      dto.contactPerson,
    );
    const id = await this.commandBus.execute<CreateCustomerCommand, string>(createCustomerCommand);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.CrmCustomersRead)
  @ApiOperation({ summary: 'List customers', description: 'Returns customers with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of customers' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listCustomers(
    @CurrentTenant() tenantId: string,
    @Query('search') search?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<CustomerResponseDto>> {
    const listCustomersQuery = new ListCustomersQuery(tenantId, { search }, page, limit);
    const result = await this.queryBus.execute<ListCustomersQuery, PaginatedResult<Customer>>(
      listCustomersQuery,
    );
    return {
      ...result,
      items: result.items.map((c) => new CustomerResponseDto(c)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.CrmCustomersRead)
  @ApiOperation({ summary: 'Get customer', description: 'Returns customer data by ID.' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiOkResponse({ type: CustomerResponseDto })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async getCustomer(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<CustomerResponseDto> {
    const getCustomerQuery = new GetCustomerQuery(id, tenantId);
    const customer = await this.queryBus.execute<GetCustomerQuery, Customer>(getCustomerQuery);
    return new CustomerResponseDto(customer);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmCustomersModify)
  @ApiOperation({ summary: 'Update customer', description: 'Updates customer data.' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiNoContentResponse({ description: 'Customer updated' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async updateCustomer(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<void> {
    const updateCustomerCommand = new UpdateCustomerCommand(
      tenantId,
      id,
      dto.name,
      dto.email,
      dto.phone,
      dto.address,
      dto.contactPerson,
    );
    await this.commandBus.execute(updateCustomerCommand);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmCustomersModify)
  @ApiOperation({ summary: 'Reactivate customer', description: 'Marks the customer as active.' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiNoContentResponse({ description: 'Customer reactivated' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async reactivateCustomer(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const reactivateCustomerCommand = new ReactivateCustomerCommand(id, tenantId);
    await this.commandBus.execute(reactivateCustomerCommand);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CrmCustomersRemove)
  @ApiOperation({ summary: 'Deactivate customer', description: 'Marks the customer as inactive.' })
  @ApiParam({ name: 'id', description: 'Customer UUID' })
  @ApiNoContentResponse({ description: 'Customer deactivated' })
  @ApiNotFoundResponse({ description: 'Customer not found' })
  async deactivateCustomer(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const deactivateCustomerCommand = new DeactivateCustomerCommand(id, tenantId);
    await this.commandBus.execute(deactivateCustomerCommand);
  }
}
