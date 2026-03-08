import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  ParseUUIDPipe,
  Post,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
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

import { RegisterMovementCommand } from '../../application/commands/register-movement/register-movement.command';
import { GetMovementQuery } from '../../application/queries/get-movement/get-movement.query';
import { ListMovementsQuery } from '../../application/queries/list-movements/list-movements.query';
import { type Movement } from '../../domain/entities/movement.entity';
import { type MovementType } from '../../domain/enums/movement-type.enum';
import { MovementResponseDto } from '../dtos/movement-response.dto';
import { RegisterMovementDto } from '../dtos/register-movement.dto';

@ApiTags('Inventory')
@ApiBearerAuth('JWT')
@Controller('inventory/movements')
export class MovementsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission(Permission.InventoryMovementsCreate)
  @ApiOperation({
    summary: 'Register movement',
    description: 'Records a manual inventory movement.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async registerMovement(
    @CurrentTenant() tenantId: string,
    @Body() dto: RegisterMovementDto,
  ): Promise<CreatedResponseDto> {
    const command = new RegisterMovementCommand(
      tenantId,
      dto.productId,
      dto.warehouseId,
      dto.type,
      dto.quantity,
      dto.referenceId ?? null,
      dto.notes ?? null,
    );
    const id = await this.commandBus.execute<RegisterMovementCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.InventoryMovementsRead)
  @ApiOperation({
    summary: 'List movements',
    description: 'Returns inventory movements with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of movements' })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listMovements(
    @CurrentTenant() tenantId: string,
    @Query('productId') productId?: string,
    @Query('warehouseId') warehouseId?: string,
    @Query('type') type?: MovementType,
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 20,
  ): Promise<PaginatedResult<MovementResponseDto>> {
    const query = new ListMovementsQuery(tenantId, { productId, warehouseId, type }, page, limit);
    const result = await this.queryBus.execute<ListMovementsQuery, PaginatedResult<Movement>>(
      query,
    );
    return {
      ...result,
      items: result.items.map((m) => new MovementResponseDto(m)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.InventoryMovementsRead)
  @ApiOperation({ summary: 'Get movement', description: 'Returns inventory movement by ID.' })
  @ApiParam({ name: 'id', description: 'Movement UUID' })
  @ApiOkResponse({ type: MovementResponseDto })
  @ApiNotFoundResponse({ description: 'Movement not found' })
  async getMovement(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<MovementResponseDto> {
    const query = new GetMovementQuery(id, tenantId);
    const movement = await this.queryBus.execute<GetMovementQuery, Movement>(query);
    return new MovementResponseDto(movement);
  }
}
