import {
  Body,
  Controller,
  DefaultValuePipe,
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

import { type PaginatedResult } from '@core/domain/contracts/paginated-result.contract';
import { Permission } from '@core/domain/enums/permission.enum';
import { CurrentTenant } from '@core/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@core/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@core/presentation/dtos/created-response.dto';

import { AssignAssetCommand } from '../../application/commands/assign-asset/assign-asset.command';
import { CreateAssetCommand } from '../../application/commands/create-asset/create-asset.command';
import { RetireAssetCommand } from '../../application/commands/retire-asset/retire-asset.command';
import { ReturnAssetCommand } from '../../application/commands/return-asset/return-asset.command';
import { UpdateAssetCommand } from '../../application/commands/update-asset/update-asset.command';
import { GetAssetQuery } from '../../application/queries/get-asset/get-asset.query';
import { ListAssetsQuery } from '../../application/queries/list-assets/list-assets.query';
import { type Asset } from '../../domain/entities/asset.entity';
import { AssetCategory } from '../../domain/enums/asset-category.enum';
import { AssetStatus } from '../../domain/enums/asset-status.enum';
import { AssetListResponseDto } from '../dtos/asset-list-response.dto';
import { AssetResponseDto } from '../dtos/asset-response.dto';
import { AssignAssetDto } from '../dtos/assign-asset.dto';
import { CreateAssetDto } from '../dtos/create-asset.dto';

@ApiTags('Organization')
@ApiBearerAuth('JWT')
@Controller('organization/assets')
export class AssetsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.OrganizationAssetsCreate)
  @ApiOperation({ summary: 'Create asset', description: 'Registers a new asset.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createAsset(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateAssetDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateAssetCommand(
      tenantId,
      dto.name,
      dto.category,
      dto.serialNumber ?? null,
      dto.description ?? null,
      dto.purchaseDate ? new Date(dto.purchaseDate) : null,
      dto.purchaseValue ?? null,
    );
    const id = await this.commandBus.execute<CreateAssetCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.OrganizationAssetsRead)
  @ApiOperation({ summary: 'List assets', description: 'Returns assets with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of assets (without assignments)' })
  @ApiQuery({ name: 'status', required: false, enum: AssetStatus })
  @ApiQuery({ name: 'category', required: false, enum: AssetCategory })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listAssets(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedResult<AssetListResponseDto>> {
    const query = new ListAssetsQuery(tenantId, { status, category, search }, page, limit);
    const result = await this.queryBus.execute<ListAssetsQuery, PaginatedResult<Asset>>(query);
    return {
      ...result,
      items: result.items.map((a) => new AssetListResponseDto(a)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.OrganizationAssetsRead)
  @ApiOperation({ summary: 'Get asset', description: 'Returns asset by ID.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiOkResponse({ type: AssetResponseDto })
  @ApiNotFoundResponse({ description: 'Asset not found' })
  async getAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<AssetResponseDto> {
    const query = new GetAssetQuery(id, tenantId);
    const asset = await this.queryBus.execute<GetAssetQuery, Asset>(query);
    return new AssetResponseDto(asset);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationAssetsModify)
  @ApiOperation({ summary: 'Update asset', description: 'Updates asset details.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiNoContentResponse({ description: 'Asset updated' })
  @ApiNotFoundResponse({ description: 'Asset not found' })
  async updateAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateAssetDto,
  ): Promise<void> {
    const command = new UpdateAssetCommand(
      id,
      tenantId,
      dto.name,
      dto.category,
      dto.serialNumber ?? null,
      dto.description ?? null,
      dto.purchaseDate ? new Date(dto.purchaseDate) : null,
      dto.purchaseValue ?? null,
    );
    await this.commandBus.execute(command);
  }

  @Patch(':id/assign')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationAssetsAssign)
  @ApiOperation({ summary: 'Assign asset', description: 'Assigns asset to a project or employee.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiNoContentResponse({ description: 'Asset assigned' })
  @ApiNotFoundResponse({ description: 'Asset not found' })
  async assignAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignAssetDto,
  ): Promise<void> {
    const command = new AssignAssetCommand(
      id,
      tenantId,
      dto.projectId ?? null,
      dto.employeeId ?? null,
    );
    await this.commandBus.execute(command);
  }

  @Patch(':id/return')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationAssetsAssign)
  @ApiOperation({ summary: 'Return asset', description: 'Returns an assigned asset.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiNoContentResponse({ description: 'Asset returned' })
  @ApiNotFoundResponse({ description: 'Asset not found' })
  async returnAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ReturnAssetCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/retire')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationAssetsRemove)
  @ApiOperation({ summary: 'Retire asset', description: 'Retires an active asset.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiNoContentResponse({ description: 'Asset retired' })
  @ApiNotFoundResponse({ description: 'Asset not found' })
  async retireAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new RetireAssetCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
