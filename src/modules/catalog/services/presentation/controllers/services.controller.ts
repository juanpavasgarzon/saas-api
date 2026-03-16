import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseBoolPipe,
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

import { CreateServiceCommand } from '../../application/commands/create-service/create-service.command';
import { DeactivateServiceCommand } from '../../application/commands/deactivate-service/deactivate-service.command';
import { ReactivateServiceCommand } from '../../application/commands/reactivate-service/reactivate-service.command';
import { UpdateServiceCommand } from '../../application/commands/update-service/update-service.command';
import { GetServiceQuery } from '../../application/queries/get-service/get-service.query';
import { ListServicesQuery } from '../../application/queries/list-services/list-services.query';
import { type Service } from '../../domain/entities/service.entity';
import { CreateServiceDto } from '../dtos/create-service.dto';
import { ServiceResponseDto } from '../dtos/service-response.dto';
import { UpdateServiceDto } from '../dtos/update-service.dto';

@ApiTags('Catalog')
@ApiBearerAuth('JWT')
@Controller('catalog/services')
export class ServicesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.CatalogServicesCreate)
  @ApiOperation({ summary: 'Create service', description: 'Registers a new catalog service.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createService(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateServiceDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateServiceCommand(
      tenantId,
      dto.name,
      dto.description ?? null,
      dto.unit,
      dto.category ?? null,
    );
    const id = await this.commandBus.execute<CreateServiceCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.CatalogServicesRead)
  @ApiOperation({
    summary: 'List services',
    description: 'Returns catalog services with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of services' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listServices(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
  ): Promise<PaginatedResult<ServiceResponseDto>> {
    const query = new ListServicesQuery(tenantId, { search, isActive }, page, limit);
    const result = await this.queryBus.execute<ListServicesQuery, PaginatedResult<Service>>(query);
    return {
      ...result,
      items: result.items.map((s) => new ServiceResponseDto(s)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.CatalogServicesRead)
  @ApiOperation({ summary: 'Get service', description: 'Returns service data by ID.' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  @ApiOkResponse({ type: ServiceResponseDto })
  @ApiNotFoundResponse({ description: 'Service not found' })
  async getService(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ServiceResponseDto> {
    const query = new GetServiceQuery(id, tenantId);
    const service = await this.queryBus.execute<GetServiceQuery, Service>(query);
    return new ServiceResponseDto(service);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CatalogServicesModify)
  @ApiOperation({ summary: 'Update service', description: 'Updates service data.' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  @ApiNoContentResponse({ description: 'Service updated' })
  @ApiNotFoundResponse({ description: 'Service not found' })
  async updateService(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateServiceDto,
  ): Promise<void> {
    const command = new UpdateServiceCommand(
      tenantId,
      id,
      dto.name,
      dto.description ?? null,
      dto.unit,
      dto.category ?? null,
    );
    await this.commandBus.execute(command);
  }

  @Patch(':id/activate')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CatalogServicesModify)
  @ApiOperation({ summary: 'Reactivate service', description: 'Marks the service as active.' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  @ApiNoContentResponse({ description: 'Service reactivated' })
  @ApiNotFoundResponse({ description: 'Service not found' })
  @ApiConflictResponse({ description: 'Service is already active' })
  async reactivateService(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ReactivateServiceCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.CatalogServicesRemove)
  @ApiOperation({ summary: 'Deactivate service', description: 'Marks the service as inactive.' })
  @ApiParam({ name: 'id', description: 'Service UUID' })
  @ApiNoContentResponse({ description: 'Service deactivated' })
  @ApiNotFoundResponse({ description: 'Service not found' })
  @ApiConflictResponse({ description: 'Service is already inactive' })
  async deactivateService(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new DeactivateServiceCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
