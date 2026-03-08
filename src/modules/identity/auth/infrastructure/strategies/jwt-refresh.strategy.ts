import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthUserData } from '@shared/application/contracts/auth-user-data.contract';
import { UnauthorizedError } from '@shared/domain/errors/unauthorized.error';

import { JwtPayload } from '../../application/contracts/jwt-payload.contract';
import { AuthService } from '../../application/services/auth.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly authService: AuthService,
    configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('jwt.refreshSecret'),
    });
  }

  async validate(payload: JwtPayload): Promise<AuthUserData> {
    const user = await this.authService.validatePayload(payload);
    if (!user) {
      throw new UnauthorizedError('Refresh token is invalid or user is inactive');
    }

    return user;
  }
}
