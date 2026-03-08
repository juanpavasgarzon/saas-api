import {
  Body,
  Controller,
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
    const id = await this.commandBus.execute<CreateAssetCommand, string>(
      new CreateAssetCommand(
        tenantId,
        dto.name,
        dto.category,
        dto.serialNumber ?? null,
        dto.description ?? null,
        dto.purchaseDate ? new Date(dto.purchaseDate) : null,
        dto.purchaseValue ?? null,
      ),
    );
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.OrganizationAssetsRead)
  @ApiOperation({ summary: 'List assets', description: 'Returns assets with pagination.' })
  @ApiOkResponse({ description: 'Paginated list of assets' })
  @ApiQuery({ name: 'status', required: false, enum: AssetStatus })
  @ApiQuery({ name: 'category', required: false, enum: AssetCategory })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listAssets(
    @CurrentTenant() tenantId: string,
    @Query('status') status?: string,
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<AssetResponseDto>> {
    const result = await this.queryBus.execute<ListAssetsQuery, PaginatedResult<Asset>>(
      new ListAssetsQuery(tenantId, { status, category, search }, page, limit),
    );
    return { ...result, items: result.items.map((a) => new AssetResponseDto(a)) };
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
    const asset = await this.queryBus.execute<GetAssetQuery, Asset>(
      new GetAssetQuery(id, tenantId),
    );
    return new AssetResponseDto(asset);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationAssetsModify)
  @ApiOperation({ summary: 'Update asset', description: 'Updates asset details.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiNoContentResponse({ description: 'Asset updated' })
  async updateAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateAssetDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdateAssetCommand(
        id,
        tenantId,
        dto.name,
        dto.category,
        dto.serialNumber ?? null,
        dto.description ?? null,
        dto.purchaseDate ? new Date(dto.purchaseDate) : null,
        dto.purchaseValue ?? null,
      ),
    );
  }

  @Patch(':id/assign')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationAssetsAssign)
  @ApiOperation({ summary: 'Assign asset', description: 'Assigns asset to a project or employee.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiNoContentResponse({ description: 'Asset assigned' })
  async assignAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignAssetDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new AssignAssetCommand(id, tenantId, dto.projectId ?? null, dto.employeeId ?? null),
    );
  }

  @Patch(':id/return')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationAssetsAssign)
  @ApiOperation({ summary: 'Return asset', description: 'Returns an assigned asset.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiNoContentResponse({ description: 'Asset returned' })
  async returnAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new ReturnAssetCommand(id, tenantId));
  }

  @Patch(':id/retire')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationAssetsRemove)
  @ApiOperation({ summary: 'Retire asset', description: 'Retires an active asset.' })
  @ApiParam({ name: 'id', description: 'Asset UUID' })
  @ApiNoContentResponse({ description: 'Asset retired' })
  async retireAsset(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    await this.commandBus.execute(new RetireAssetCommand(id, tenantId));
  }
}
