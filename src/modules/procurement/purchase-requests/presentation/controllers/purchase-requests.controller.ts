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

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@shared/presentation/dtos/created-response.dto';

import { ApprovePurchaseRequestCommand } from '../../application/commands/approve-purchase-request/approve-purchase-request.command';
import { CreatePurchaseRequestCommand } from '../../application/commands/create-purchase-request/create-purchase-request.command';
import { RejectPurchaseRequestCommand } from '../../application/commands/reject-purchase-request/reject-purchase-request.command';
import { SubmitPurchaseRequestCommand } from '../../application/commands/submit-purchase-request/submit-purchase-request.command';
import { GetPurchaseRequestQuery } from '../../application/queries/get-purchase-request/get-purchase-request.query';
import { ListPurchaseRequestsQuery } from '../../application/queries/list-purchase-requests/list-purchase-requests.query';
import { type PurchaseRequest } from '../../domain/entities/purchase-request.entity';
import { PurchaseRequestStatus } from '../../domain/enums/purchase-request-status.enum';
import { CreatePurchaseRequestDto } from '../dtos/create-purchase-request.dto';
import { PurchaseRequestResponseDto } from '../dtos/purchase-request-response.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/purchase-requests')
export class PurchaseRequestsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.ProcurementPurchaseRequestsCreate)
  @ApiOperation({
    summary: 'Create purchase request',
    description: 'Creates a new draft purchase request.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createPurchaseRequest(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreatePurchaseRequestDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreatePurchaseRequestCommand(
      tenantId,
      dto.title,
      dto.vendorId ?? null,
      dto.vendorProspectId ?? null,
      dto.notes ?? null,
      dto.items,
    );
    const id = await this.commandBus.execute<CreatePurchaseRequestCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.ProcurementPurchaseRequestsRead)
  @ApiOperation({
    summary: 'List purchase requests',
    description: 'Returns purchase requests with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of purchase requests' })
  @ApiQuery({ name: 'status', required: false, enum: PurchaseRequestStatus })
  @ApiQuery({ name: 'vendorId', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listPurchaseRequests(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('status') status?: PurchaseRequestStatus,
    @Query('vendorId') vendorId?: string,
  ): Promise<PaginatedResult<PurchaseRequestResponseDto>> {
    const query = new ListPurchaseRequestsQuery(tenantId, status, vendorId, page, limit);
    const result = await this.queryBus.execute<
      ListPurchaseRequestsQuery,
      PaginatedResult<PurchaseRequest>
    >(query);
    return {
      ...result,
      items: result.items.map((pr) => new PurchaseRequestResponseDto(pr)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.ProcurementPurchaseRequestsRead)
  @ApiOperation({
    summary: 'Get purchase request',
    description: 'Returns purchase request data by ID.',
  })
  @ApiParam({ name: 'id', description: 'Purchase request UUID' })
  @ApiOkResponse({ type: PurchaseRequestResponseDto })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async getPurchaseRequest(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<PurchaseRequestResponseDto> {
    const query = new GetPurchaseRequestQuery(id, tenantId);
    const pr = await this.queryBus.execute<GetPurchaseRequestQuery, PurchaseRequest>(query);
    return new PurchaseRequestResponseDto(pr);
  }

  @Patch(':id/submit')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementPurchaseRequestsCreate)
  @ApiOperation({
    summary: 'Submit purchase request',
    description: 'Transitions purchase request from DRAFT to PENDING_REVIEW.',
  })
  @ApiParam({ name: 'id', description: 'Purchase request UUID' })
  @ApiNoContentResponse({ description: 'Purchase request submitted' })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async submitPurchaseRequest(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new SubmitPurchaseRequestCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/approve')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementPurchaseRequestsApprove)
  @ApiOperation({
    summary: 'Approve purchase request',
    description:
      'Transitions purchase request from PENDING_REVIEW to APPROVED and automatically creates a purchase order.',
  })
  @ApiParam({ name: 'id', description: 'Purchase request UUID' })
  @ApiNoContentResponse({ description: 'Purchase request approved' })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async approvePurchaseRequest(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ApprovePurchaseRequestCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Patch(':id/reject')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.ProcurementPurchaseRequestsApprove)
  @ApiOperation({
    summary: 'Reject purchase request',
    description: 'Transitions purchase request from PENDING_REVIEW to REJECTED.',
  })
  @ApiParam({ name: 'id', description: 'Purchase request UUID' })
  @ApiNoContentResponse({ description: 'Purchase request rejected' })
  @ApiNotFoundResponse({ description: 'Purchase request not found' })
  async rejectPurchaseRequest(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new RejectPurchaseRequestCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
