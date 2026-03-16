import {
  Body,
  Controller,
  DefaultValuePipe,
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

import { CreateCustomerCommand } from '../../application/commands/create-customer/create-customer.command';
import { DeactivateCustomerCommand } from '../../application/commands/deactivate-customer/deactivate-customer.command';
import { ReactivateCustomerCommand } from '../../application/commands/reactivate-customer/reactivate-customer.command';
import { UpdateCustomerCommand } from '../../application/commands/update-customer/update-customer.command';
import { GetCustomerQuery } from '../../application/queries/get-customer/get-customer.query';
import { ListCustomersQuery } from '../../application/queries/list-customers/list-customers.query';
import { SearchCustomersQuery } from '../../application/queries/search-customers/search-customers.query';
import { Customer } from '../../domain/entities/customer.entity';
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
      dto.company ?? null,
      dto.identificationNumber,
      dto.address,
      dto.contactPerson ?? null,
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
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
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

  @Get('search')
  @RequirePermission(Permission.CrmCustomersRead)
  @ApiOperation({
    summary: 'Search customers',
    description: 'Searches customers by name, identification number, contact person, or company.',
  })
  @ApiQuery({ name: 'search', required: true })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  @ApiOkResponse({
    description: 'List of customers matching the search criteria',
    type: [CustomerResponseDto],
  })
  async searchCustomers(
    @CurrentTenant() tenantId: string,
    @Query('search') search: string,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<CustomerResponseDto[]> {
    const searchCustomersQuery = new SearchCustomersQuery(tenantId, search, limit);
    const customers = await this.queryBus.execute<SearchCustomersQuery, Customer[]>(
      searchCustomersQuery,
    );
    return customers.map((c) => new CustomerResponseDto(c));
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
      dto.company ?? null,
      dto.identificationNumber,
      dto.address,
      dto.contactPerson ?? null,
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
  @ApiConflictResponse({ description: 'Customer is already active' })
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
  @ApiConflictResponse({ description: 'Customer is already inactive' })
  async deactivateCustomer(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const deactivateCustomerCommand = new DeactivateCustomerCommand(id, tenantId);
    await this.commandBus.execute(deactivateCustomerCommand);
  }
}
