import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
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
import { ICompanyLogoService } from '@modules/organization/companies/application/contracts/company-logo-service.contract';
import { COMPANY_LOGO_SERVICE } from '@modules/organization/companies/application/tokens/company-logo-service.token';

import { UpdateCompanyCommand } from '../../application/commands/update-company/update-company.command';
import { GetCompanyQuery } from '../../application/queries/get-company/get-company.query';
import { type Company } from '../../domain/entities/company.entity';
import { CompanyResponseDto } from '../dtos/company-response.dto';
import { UpdateCompanyDto } from '../dtos/update-company.dto';

@ApiTags('Organization')
@ApiBearerAuth('JWT')
@Controller('organization/companies')
export class CompaniesController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
    @Inject(COMPANY_LOGO_SERVICE)
    private readonly companyLogoService: ICompanyLogoService,
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
    description: 'Uploads a logo (PNG, JPG, WebP — max 2 MB). Normalized and stored as PNG.',
  })
  @ApiNoContentResponse({ description: 'Logo uploaded' })
  async uploadLogo(
    @CurrentTenant() tenantId: string,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<void> {
    const base64 = await this.companyLogoService.prepareLogoBase64(file);

    const getCompanyQuery = new GetCompanyQuery(tenantId);
    const company = await this.queryBus.execute<GetCompanyQuery, Company>(getCompanyQuery);

    const updateCompanyCommand = new UpdateCompanyCommand(tenantId, company.name, base64);
    await this.commandBus.execute(updateCompanyCommand);
  }
}
