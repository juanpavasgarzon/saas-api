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

import { type PaginatedResult } from '@shared/domain/contracts/paginated-result.contract';
import { Permission } from '@shared/domain/enums/permission.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { RequirePermission } from '@shared/presentation/decorators/require-permission.decorator';
import { CreatedResponseDto } from '@shared/presentation/dtos/created-response.dto';

import { CreateProductCommand } from '../../application/commands/create-product/create-product.command';
import { DeactivateProductCommand } from '../../application/commands/deactivate-product/deactivate-product.command';
import { ReactivateProductCommand } from '../../application/commands/reactivate-product/reactivate-product.command';
import { UpdateProductCommand } from '../../application/commands/update-product/update-product.command';
import { GetProductQuery } from '../../application/queries/get-product/get-product.query';
import { ListProductsQuery } from '../../application/queries/list-products/list-products.query';
import { type Product } from '../../domain/entities/product.entity';
import { CreateProductDto } from '../dtos/create-product.dto';
import { ProductResponseDto } from '../dtos/product-response.dto';
import { UpdateProductDto } from '../dtos/update-product.dto';

@ApiTags('Inventory')
@ApiBearerAuth('JWT')
@Controller('inventory/products')
export class ProductsController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  @RequirePermission(Permission.InventoryProductsCreate)
  @ApiOperation({ summary: 'Create product', description: 'Registers a new inventory product.' })
  @ApiCreatedResponse({ type: CreatedResponseDto })
  async createProduct(
    @CurrentTenant() tenantId: string,
    @Body() dto: CreateProductDto,
  ): Promise<CreatedResponseDto> {
    const command = new CreateProductCommand(
      tenantId,
      dto.name,
      dto.sku,
      dto.description ?? null,
      dto.unit,
      dto.category ?? null,
    );
    const id = await this.commandBus.execute<CreateProductCommand, string>(command);
    return new CreatedResponseDto(id);
  }

  @Get()
  @RequirePermission(Permission.InventoryProductsRead)
  @ApiOperation({
    summary: 'List products',
    description: 'Returns inventory products with pagination.',
  })
  @ApiOkResponse({ description: 'Paginated list of products' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'isActive', required: false })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 20 })
  async listProducts(
    @CurrentTenant() tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('search') search?: string,
    @Query('isActive', new ParseBoolPipe({ optional: true })) isActive?: boolean,
  ): Promise<PaginatedResult<ProductResponseDto>> {
    const query = new ListProductsQuery(tenantId, { search, isActive }, page, limit);
    const result = await this.queryBus.execute<ListProductsQuery, PaginatedResult<Product>>(query);
    return {
      ...result,
      items: result.items.map((p) => new ProductResponseDto(p)),
    };
  }

  @Get(':id')
  @RequirePermission(Permission.InventoryProductsRead)
  @ApiOperation({ summary: 'Get product', description: 'Returns product data by ID.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiOkResponse({ type: ProductResponseDto })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async getProduct(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<ProductResponseDto> {
    const query = new GetProductQuery(id, tenantId);
    const product = await this.queryBus.execute<GetProductQuery, Product>(query);
    return new ProductResponseDto(product);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.InventoryProductsModify)
  @ApiOperation({ summary: 'Update product', description: 'Updates product data.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiNoContentResponse({ description: 'Product updated' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  async updateProduct(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<void> {
    const command = new UpdateProductCommand(
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
  @RequirePermission(Permission.InventoryProductsModify)
  @ApiOperation({ summary: 'Reactivate product', description: 'Marks the product as active.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiNoContentResponse({ description: 'Product reactivated' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiConflictResponse({ description: 'Product is already active' })
  async reactivateProduct(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new ReactivateProductCommand(id, tenantId);
    await this.commandBus.execute(command);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequirePermission(Permission.InventoryProductsRemove)
  @ApiOperation({ summary: 'Deactivate product', description: 'Marks the product as inactive.' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiNoContentResponse({ description: 'Product deactivated' })
  @ApiNotFoundResponse({ description: 'Product not found' })
  @ApiConflictResponse({ description: 'Product is already inactive' })
  async deactivateProduct(
    @CurrentTenant() tenantId: string,
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<void> {
    const command = new DeactivateProductCommand(id, tenantId);
    await this.commandBus.execute(command);
  }
}
