import { type LineItemInput } from './line-item-input.contract';

export interface ILineItemValidatorService {
  validate(items: LineItemInput[], tenantId: string): Promise<void>;
}
