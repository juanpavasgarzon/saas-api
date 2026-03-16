import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryBus } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';

import { type AuthUserData } from '@core/application/contracts/auth-user-data.contract';
import { type HashService } from '@modules/identity/users/application/contracts/hash-service.contract';
import { GetUserQuery } from '@modules/identity/users/application/queries/get-user/get-user.query';
import { HASH_SERVICE } from '@modules/identity/users/application/tokens/hash-service.token';
import { type IUserRepository } from '@modules/identity/users/domain/contracts/user-repository.contract';
import { type User } from '@modules/identity/users/domain/entities/user.entity';
import { USER_REPOSITORY } from '@modules/identity/users/domain/tokens/user-repository.token';

import { InvalidCredentialsError } from '../../domain/errors/invalid-credentials.error';
import { UserInactiveError } from '../../domain/errors/user-inactive.error';
import { type JwtPayload } from '../contracts/jwt-payload.contract';
import { type TokenPair } from '../contracts/token-pair.contract';

@Injectable()
export class AuthService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    @Inject(HASH_SERVICE)
    private readonly hashService: HashService,
    private readonly queryBus: QueryBus,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string): Promise<TokenPair> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new InvalidCredentialsError();
    }

    const isValid = await this.hashService.compare(password, user.passwordHash);
    if (!isValid) {
      throw new InvalidCredentialsError();
    }

    if (!user.isActive) {
      throw new UserInactiveError();
    }

    return this.generateTokenPair({
      id: user.id,
      tenantId: user.tenantId,
      email: user.email.value,
      role: user.role,
      isActive: user.isActive,
    });
  }

  async validatePayload(payload: JwtPayload): Promise<AuthUserData | null> {
    try {
      const user = await this.queryBus.execute<GetUserQuery, User>(new GetUserQuery(payload.sub));
      if (!user || !user.isActive) {
        return null;
      }

      return {
        id: user.id,
        tenantId: user.tenantId,
        email: user.email.value,
        role: user.role,
        isActive: user.isActive,
      };
    } catch {
      return null;
    }
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
