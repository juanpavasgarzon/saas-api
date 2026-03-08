import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';

import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';

import { UpdateCompanyCommand } from '../../application/commands/update-company/update-company.command';
import { GetCompanyQuery } from '../../application/queries/get-company/get-company.query';
import { type Company } from '../../domain/entities/company.entity';
import { CompanyResponseDto } from '../dtos/company-response.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';

const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2 MB

@ApiTags('Organization')
@ApiBearerAuth('JWT')
@Controller('organization/companies')
export class CompaniesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Get()
  @RequirePermission(Permission.OrganizationCompaniesRead)
  @ApiOperation({
    summary: 'Get company',
    description: 'Returns the company profile of the current tenant.',
  })
  @ApiOkResponse({ type: CompanyResponseDto })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async getCompany(@CurrentTenant() tenantId: string): Promise<CompanyResponseDto> {
    const getCompanyQuery = new GetCompanyQuery(tenantId);
    const company = await this.queryBus.execute<GetCompanyQuery, Company>(getCompanyQuery);
    return new CompanyResponseDto(company);
  }

  @Patch()
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationCompaniesModify)
  @ApiOperation({
    summary: 'Update company',
    description: 'Updates the company name and/or logo URL.',
  })
  @ApiNoContentResponse({ description: 'Company updated' })
  @ApiNotFoundResponse({ description: 'Company not found' })
  async updateCompany(
    @CurrentTenant() tenantId: string,
    @Body() dto: UpdateCompanyDto,
  ): Promise<void> {
    const updateCompanyCommand = new UpdateCompanyCommand(tenantId, dto.name, dto.logo ?? null);
    await this.commandBus.execute(updateCompanyCommand);
  }

  @Post('logo')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.OrganizationCompaniesModify)
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @ApiOperation({
    summary: 'Upload company logo',
    description: 'Uploads a logo (PNG, JPG, SVG, WebP — max 2 MB). Stored as base64.',
  })
  @ApiNoContentResponse({ description: 'Logo uploaded' })
  async uploadLogo(
    @CurrentTenant() tenantId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      throw new BadRequestException('Only PNG, JPG, SVG and WebP images are allowed');
    }
    if (file.size > MAX_SIZE_BYTES) {
      throw new BadRequestException('Logo file must be smaller than 2 MB');
    }

    const base64 = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
    const getCompanyQuery = new GetCompanyQuery(tenantId);
    const company = await this.queryBus.execute<GetCompanyQuery, Company>(getCompanyQuery);
    const updateCompanyCommand = new UpdateCompanyCommand(tenantId, company.name, base64);
    await this.commandBus.execute(updateCompanyCommand);
  }
}
