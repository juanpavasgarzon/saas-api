import { type AssetCategory } from '../../../domain/enums/asset-category.enum';

export class UpdateAssetCommand {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    public readonly name: string,
    public readonly category: AssetCategory,
    public readonly serialNumber: string | null,
    public readonly description: string | null,
    public readonly purchaseDate: Date | null,
    public readonly purchaseValue: number | null,
  ) {}
}
