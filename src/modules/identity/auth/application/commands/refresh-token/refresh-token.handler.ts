import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TokenPair } from '../../contracts/token-pair.contract';
import { AuthService } from '../../services/auth.service';
import { RefreshTokenCommand } from './refresh-token.command';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler implements ICommandHandler<RefreshTokenCommand, TokenPair> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: RefreshTokenCommand): Promise<TokenPair> {
    const result = this.authService.refreshTokens(command.user);
    return Promise.resolve(result);
  }
}
