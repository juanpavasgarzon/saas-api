import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { TokenPair } from '../../contracts/token-pair.contract';
import { AuthService } from '../../services/auth.service';
import { LoginCommand } from './login.command';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand, TokenPair> {
  constructor(private readonly authService: AuthService) {}

  async execute(command: LoginCommand): Promise<TokenPair> {
    return this.authService.login(command.email, command.password);
  }
}
