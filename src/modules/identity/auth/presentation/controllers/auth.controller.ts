import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { type AuthUserData } from '@shared/application/contracts/auth-user-data.contract';
import { Public } from '@shared/presentation/decorators/public.decorator';

import { LoginCommand } from '../../application/commands/login/login.command';
import { RefreshTokenCommand } from '../../application/commands/refresh-token/refresh-token.command';
import { RegisterCommand } from '../../application/commands/register/register.command';
import { type RegisterResult } from '../../application/contracts/register.contract';
import { type TokenPair } from '../../application/contracts/token-pair.contract';
import { LoginDto } from '../dtos/login.dto';
import { MeResponseDto } from '../dtos/me-response.dto';
import { RefreshTokenDto } from '../dtos/refresh-token.dto';
import { RegisterDto } from '../dtos/register.dto';
import { RegisterResponseDto } from '../dtos/register-response.dto';
import { TokenResponseDto } from '../dtos/token-response.dto';
import { JwtRefreshGuard } from '../guards/jwt-refresh.guard';

@ApiTags('Identity')
@Controller('identity/auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

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
  @ApiBody({ type: RefreshTokenDto })
  @ApiOkResponse({ type: TokenResponseDto })
  @ApiUnauthorizedResponse({ description: 'Refresh token invalid or expired' })
  async refresh(@Req() req: Request): Promise<TokenResponseDto> {
    const user = req.user as AuthUserData;
    const refreshCommand = new RefreshTokenCommand(user);
    const pair = await this.commandBus.execute<RefreshTokenCommand, TokenPair>(refreshCommand);
    return new TokenResponseDto(pair);
  }

  @Get('me')
  @ApiBearerAuth('JWT')
  @ApiOperation({
    summary: 'Get current user',
    description: 'Returns the authenticated user data extracted from the JWT.',
  })
  @ApiOkResponse({ type: MeResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired token' })
  getMe(@Req() req: Request): MeResponseDto {
    const user = req.user as AuthUserData;
    return new MeResponseDto(user);
  }
}
