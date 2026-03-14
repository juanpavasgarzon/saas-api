import { NotFoundError } from '@core/domain/errors/not-found.error';

export class PayrollEntryNotFoundError extends NotFoundError {
  constructor(id: string) {
    super('PayrollEntry', id);
  }
}
