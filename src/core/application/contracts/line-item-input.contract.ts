import { type LineItemType } from '../../domain/enums/line-item-type.enum';

export interface LineItemInput {
  itemType: LineItemType;
  itemId: string;
}
