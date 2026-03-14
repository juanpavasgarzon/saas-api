import { ValidationError } from '@core/domain/errors/validation.error';
import { ValueObject } from '@core/domain/value-object.base';

import { type EmailProps } from '../contracts/email-props.contract';

export class Email extends ValueObject<EmailProps> {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  constructor(value: string) {
    if (!Email.EMAIL_REGEX.test(value)) {
      throw new ValidationError(`"${value}" is not a valid email address`);
    }

    super({ value: value.toLowerCase().trim() });
  }

  get value(): string {
    return this.props.value;
  }

  toString(): string {
    return this.props.value;
  }
}
