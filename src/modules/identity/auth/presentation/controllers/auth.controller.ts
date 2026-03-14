import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { type AuthUserData } from '@shared/application/contracts/auth-user-data.contract';
import { ICompanyProfileService } from '@shared/application/contracts/company-profile.contract';
import { COMPANY_PROFILE_SERVICE } from '@shared/application/tokens/company-profile.token';
import { ROLE_PERMISSIONS } from '@shared/domain/enums/role-permissions';
import { UserRole } from '@shared/domain/enums/user-role.enum';
import { CurrentTenant } from '@shared/presentation/decorators/current-tenant.decorator';
import { Public } from '@shared/presentation/decorators/public.decorator';

import { LoginCommand } from '../../application/commands/login/login.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token/refresh-token.command';
import { RegisterCommand } from '../../application/commands/register/register.command';
import { type RegisterResult } from '../../application/contracts/register.contract';
import { type TokenPair } from '../../application/contracts/token-pair.contract';
import { LoginDto } from '../dtos/login.dto';
import { MeResponseDto } from '../dtos/me-response.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterResponseDto } from '../dtos/register-response.dto';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

@ApiTags('Identity')
@Controller('identity/auth')
export class AuthController {
  constructor(
    private readonly commandBus: CommandBus,
    @Inject(COMPANY_PROFILE_SERVICE)
    private readonly companyProfileService: ICompanyProfileService,
  ) {}

  @Post('register')
  @Public()
  @ApiOperation({
    summary: 'Register company',
    description:
      'Creates a new tenant (company) along with its OWNER user. No authentication required.',
  })
  @ApiCreatedResponse({ type: RegisterResponseDto })
  async register(@Body() dto: RegisterDto): Promise<RegisterResponseDto> {
    const registerCommand = new RegisterCommand(dto.companyName, dto.email, dto.password);
    const result = await this.commandBus.execute<RegisterCommand, RegisterResult>(registerCommand);
    return new RegisterResponseDto(result);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Login',
    description: 'Authenticates the user and returns a JWT token pair.',
  })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() dto: LoginDto): Promise<TokenResponseDto> {
    const loginCommand = new LoginCommand(dto.email, dto.password);
    const pair = await this.commandBus.execute<LoginCommand, TokenPair>(loginCommand);
    return new TokenResponseDto(pair);
  }

  @Post('refresh')
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtRefreshGuard)
  @ApiOperation({
    summary: 'Refresh tokens',
    description: 'Validates the refresh token and issues a new access + refresh token pair.',
  })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
  async refresh(@Req() req: Request): Promise<TokenResponseDto> {
    const user = req.user as AuthUserData;
    const refreshCommand = new RefreshTokenCommand(user);
    const pair = await this.commandBus.execute<RefreshTokenCommand, TokenPair>(refreshCommand);
    return new TokenResponseDto(pair);
  }

  // @Post('recover-password')
  // @Public()
  // @HttpCode(HttpStatus.OK)
  // @ApiOperation({
  //   summary: 'Recover password',
  //   description: 'Initiates the password recovery process',
  // })
  // @ApiOkResponse({ description: 'Password recovery initiated (placeholder)' })
  // async recoverPassword(@Body('email') email: string): Promise<void> {
  //   return {};
  // }

  @Get('me')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the authenticated user data extracted from the JWT.',
  })
  @ApiOkResponse({ type: MeResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  async getMe(@CurrentTenant() tenant: string, @Req() req: Request): Promise<MeResponseDto> {
    const profile = await this.companyProfileService.getProfile(tenant);
    const user = req.user as AuthUserData;
    const role = user.role as UserRole;
    const permissions = ROLE_PERMISSIONS[role] || [];
    return new MeResponseDto(user, profile.name, profile.logo, permissions);
  }
}
