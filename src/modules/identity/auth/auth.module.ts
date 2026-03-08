import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UsersModule } from '@modules/identity/users/users.module';
import { CompaniesModule } from '@modules/organization/companies/companies.module';

import { LoginHandler } from './application/commands/login/login.handler';
import { RefreshTokenHandler } from './application/commands/refresh-token/refresh-token.handler';
import { RegisterHandler } from './application/commands/register/register.handler';
import { AuthService } from './application/services/auth.service';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { JwtRefreshStrategy } from './infrastructure/strategies/jwt-refresh.strategy';
import { AuthController } from './presentation/controllers/auth.controller';
import { JwtRefreshGuard } from './presentation/guards/jwt-refresh.guard';

@Module({
  imports: [
    CqrsModule,
    ConfigModule,
    PassportModule,
    JwtModule.register({}),
    UsersModule,
    CompaniesModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginHandler,
    RegisterHandler,
    RefreshTokenHandler,
    AuthService,
    JwtStrategy,
    JwtRefreshStrategy,
    JwtRefreshGuard,
  ],
})
export class AuthModule {}
