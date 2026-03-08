import { type AssetCategory } from '../enums/asset-category.enum';
import { type AssetStatus } from '../enums/asset-status.enum';
import { type AssetAssignmentProps } from './asset-assignment-props.contract';

export interface AssetProps {
  id: string;
  tenantId: string;
  number: number;
  name: string;
  category: AssetCategory;
  serialNumber: string | null;
  description: string | null;
  status: AssetStatus;
  purchaseDate: Date | null;
  purchaseValue: number | null;
  assignments: AssetAssignmentProps[];
  createdAt: Date;
  updatedAt: Date;
}
