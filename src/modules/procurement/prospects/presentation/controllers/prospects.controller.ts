import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiBearerAuth, ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@shared/presentation/dtos/created-response.dto';

import { CreateProspectCommand } from '../../application/commands/create-prospect/create-prospect.command';
import { CreateProspectDto } from '../dtos/create-prospect.dto';

@ApiTags('Procurement')
@ApiBearerAuth('JWT')
@Controller('procurement/prospects')
export class ProspectsController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @RequirePermission(Permission.ProcurementVendorsCreate)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create prospect',
    description: 'Creates a new prospect that can later be converted to a vendor.',
  })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createProspect(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateProspectDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateProspectCommand(
      tenantId,
      dto.name,
      dto.email ?? null,
      dto.phone ?? null,
      dto.company ?? null,
      dto.notes ?? null,
    );
    const id = await this.commandBus.execute<CreateProspectCommand, string>(command);
    return new CreatedResponseDto(id);
  }
}
