import { Inject, Injectable } from '@nestjs/common';

import { LineItemType } from '@core/domain/enums/line-item-type.enum';
import { ValidationError } from '@core/domain/errors/validation.error';

import { type LineItemInput } from '../contracts/line-item-input.contract';
import { type ILineItemTypeAdapter } from '../contracts/line-item-type-adapter.contract';
import { type ILineItemValidatorService } from '../contracts/line-item-validator.contract';
import {
  ASSET_LINE_ITEM_ADAPTER,
  PRODUCT_LINE_ITEM_ADAPTER,
  SERVICE_LINE_ITEM_ADAPTER,
} from '../tokens/line-item-adapters.tokens';

@Injectable()
export class LineItemValidatorService implements ILineItemValidatorService {
  private readonly adapterMap: Map<LineItemType, ILineItemTypeAdapter>;

  constructor(
    @Inject(PRODUCT_LINE_ITEM_ADAPTER) productAdapter: ILineItemTypeAdapter,
    @Inject(SERVICE_LINE_ITEM_ADAPTER) serviceAdapter: ILineItemTypeAdapter,
    @Inject(ASSET_LINE_ITEM_ADAPTER) assetAdapter: ILineItemTypeAdapter,
  ) {
    this.adapterMap = new Map([
      [LineItemType.PRODUCT, productAdapter],
      [LineItemType.SERVICE, serviceAdapter],
      [LineItemType.ASSET, assetAdapter],
    ]);
  }

  async validate(items: LineItemInput[], tenantId: string): Promise<void> {
    const grouped = new Map<LineItemType, string[]>();
    for (const item of items) {
      if (!grouped.has(item.itemType)) {
        grouped.set(item.itemType, []);
      }
      grouped.get(item.itemType)!.push(item.itemId);
    }

    for (const [type, ids] of grouped.entries()) {
      const adapter = this.adapterMap.get(type);
      if (!adapter) {
        throw new ValidationError(`Unsupported line item type: ${type}`);
      }

      const existingIds = await adapter.findExistingIds(ids, tenantId);
      const missingIds = ids.filter((id) => !existingIds.includes(id));

      if (missingIds.length > 0) {
        throw new ValidationError(
          `The following ${type} IDs do not exist or are inactive: ${missingIds.join(', ')}`,
        );
      }
    }
  }
}
