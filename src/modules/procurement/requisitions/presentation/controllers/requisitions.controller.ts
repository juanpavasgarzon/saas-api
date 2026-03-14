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

import { ApproveRequisitionCommand } from '../../application/commands/approve-requisition/approve-requisition.command';
import { CreateRequisitionCommand } from '../../application/commands/create-requisition/create-requisition.command';
import { RejectRequisitionCommand } from '../../application/commands/reject-requisition/reject-requisition.command';
import { SubmitRequisitionCommand } from '../../application/commands/submit-requisition/submit-requisition.command';
import { GetRequisitionQuery } from '../../application/queries/get-requisition/get-requisition.query';
import { ListRequisitionsQuery } from '../../application/queries/list-requisitions/list-requisitions.query';
import { type Requisition } from '../../domain/entities/requisition.entity';
import { RequisitionStatus } from '../../domain/enums/requisition-status.enum';
import { CreateRequisitionDto } from '../dtos/create-requisition.dto';
import { RequisitionResponseDto } from '../dtos/requisition-response.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/requisitions')
export class RequisitionsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProcurementRequisitionsCreate)
  @ApiOperation({
    summary: 'Create purchase request',
    description: 'Creates a new draft purchase request.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createRequisition(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateRequisitionDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateRequisitionCommand(
      tenantId,
      dto.title,
      dto.supplierId ?? null,
      dto.supplierProspectId ?? null,
      dto.notes ?? null,
      dto.items,
    );
    const id = await this.commandBus.execute<CreateRequisitionCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.ProcurementRequisitionsRead)
  @ApiOperation({
    summary: 'List purchase requests',
    description: 'Returns purchase requests with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of purchase requests' })
  @ApiQuery({ name: 'status', required: false, enum: RequisitionStatus })
  @ApiQuery({ name: 'supplierId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listRequisitions(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: RequisitionStatus,
    @Query('supplierId') supplierId?: string,
  ): Promise<PaginatedResult<RequisitionResponseDto>> {
    const query = new ListRequisitionsQuery(tenantId, status, supplierId, page, limit);
    const result = await this.queryBus.execute<ListRequisitionsQuery, PaginatedResult<Requisition>>(
      query,
    );
    return {
      ...result,
      items: result.items.map((pr) => new RequisitionResponseDto(pr)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementRequisitionsRead)
  @ApiOperation({
    summary: 'Get purchase request',
    description: 'Returns purchase request data by ID.',
  })
  @ApiParam({ name: 'id', description: 'Purchase request UUID' })
  @ApiOkResponse({ type: RequisitionResponseDto })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async getRequisition(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<RequisitionResponseDto> {
    const query = new GetRequisitionQuery(id, tenantId);
    const pr = await this.queryBus.execute<GetRequisitionQuery, Requisition>(query);
    return new RequisitionResponseDto(pr);
  }

  @Patch(':id/submit')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementRequisitionsCreate)
  @ApiOperation({
    summary: 'Submit purchase request',
    description: 'Transitions purchase request from DRAFT to PENDING_REVIEW.',
  })
  @ApiParam({ name: 'id', description: 'Purchase request UUID' })
  @ApiNoContentResponse({ description: 'Purchase request submitted' })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async submitRequisition(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new SubmitRequisitionCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementRequisitionsApprove)
  @ApiOperation({
    summary: 'Approve purchase request',
    description:
      'Transitions purchase request from PENDING_REVIEW to APPROVED and automatically creates a purchase order.',
  })
  @ApiParam({ name: 'id', description: 'Purchase request UUID' })
  @ApiNoContentResponse({ description: 'Purchase request approved' })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async approveRequisition(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ApproveRequisitionCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementRequisitionsApprove)
  @ApiOperation({
    summary: 'Reject purchase request',
    description: 'Transitions purchase request from PENDING_REVIEW to REJECTED.',
  })
  @ApiParam({ name: 'id', description: 'Purchase request UUID' })
  @ApiNoContentResponse({ description: 'Purchase request rejected' })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async rejectRequisition(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new RejectRequisitionCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
