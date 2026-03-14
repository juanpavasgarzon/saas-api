import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { AuthUserData } from '@core/application/contracts/auth-user-data.contract';
import { IAuthUserService } from '@modules/identity/users/application/contracts/auth-user-service.contract';
import { AUTH_USER_SERVICE } from '@modules/identity/users/application/tokens/auth-user-service.token';

import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { UserInactiveError } from '../../domain/errors/user-inactive.error';
import { JwtPayload } from '../contracts/jwt-payload.contract';
import { TokenPair } from '../contracts/token-pair.contract';

@Injectable()
export class AuthService {
  constructor(
    @Inject(AUTH_USER_SERVICE)
    private readonly userService: IAuthUserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.userService.validateCredentials(email, password);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new UserInactiveError();
    }

    return this.generateTokenPair(user);
  }

  async validatePayload(payload: JwtPayload): Promise<AuthUserData | null> {
    const user = await this.userService.getUserById(payload.sub);
    if (!user || !user.isActive) {
      return null;
    }

    return user;
  }

  refreshTokens(user: AuthUserData): TokenPair {
    return this.generateTokenPair(user);
  }

  private generateTokenPair(user: AuthUserData): TokenPair {
    const payload: JwtPayload = {
      sub: user.id,
      tenantId: user.tenantId,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get('jwt.expiresIn'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refreshSecret'),
      expiresIn: this.configService.get('jwt.refreshExpiresIn'),
    });

    return { accessToken, refreshToken };
  }
}
