# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run start:dev          # watch mode
npm run docker:dev         # Docker dev (mounts source, debug port 9229)

# Build & lint
npm run build
npm run lint               # eslint --fix
npm run format             # prettier --write

# Tests
npm test                                              # all unit tests
npm test -- --testPathPattern=employee.service        # single file/pattern
npm run test:e2e
npm run test:cov

# Migrations
npm run migration:generate -- src/database/migrations/MigrationName
npm run migration:run
npm run migration:revert
```

## Architecture Overview

Multi-tenant SaaS API built as a **modular monolith** using NestJS + TypeORM + CQRS + PostgreSQL.

### Module Hierarchy

```
AppModule
├── IdentityModule      → auth, users, invitations
├── OrganizationModule  → companies, employees
├── CrmModule           → customers
├── ProjectModule → projects (includes project_members child entity)
├── FinanceModule       → payroll, accounting
└── InfrastructureModule → notifications, tenant
```

### CQRS Pattern

Every module uses `@nestjs/cqrs`. The flow is:

```
Controller → CommandBus/QueryBus → Handler → Service (optional) → Repository
```

- **Commands** live in `application/commands/{action}/{action}.command.ts` + `.handler.ts`
- **Queries** live in `application/queries/{action}/{action}.query.ts` + `.handler.ts`
- **Services** (`application/services/`) orchestrate commands/queries when controllers need a thin facade
- Handlers and services are all registered in the module's `providers` array

### Cross-Module Communication

Modules never import each other's service classes directly. The pattern:

1. Define interface in `src/shared/application/contracts/`
2. Define token (Symbol) in `src/shared/application/tokens/` or the module's `domain/tokens/`
3. Provider module: `{ provide: TOKEN, useClass: Adapter }` + `exports: [TOKEN]`
4. Consumer module: `@Inject(TOKEN) private readonly svc: IContract`

Example: `UsersModule` exports `AUTH_USER_SERVICE` (backed by `AuthUserAdapter`) and `HASH_SERVICE`. `AuthModule` imports `UsersModule` and injects via those tokens.

### Authentication & Authorization

- `JwtAuthGuard` is registered as **global** `APP_GUARD` in `AppModule` — all routes are protected by default.
- Mark public endpoints with `@Public()` from `@shared/presentation/decorators/public.decorator`.
- Extract the current user's tenant from JWT with `@CurrentTenant()` from `@shared/presentation/decorators/current-tenant.decorator`. Returns `tenantId: string`.
- `AuthUserData` shape (from `@shared/application/contracts/auth-user-data.contract`): `{ id, tenantId, email, role, isActive }`.

### Error Handling

`GlobalHttpExceptionFilter` (registered in `main.ts`) handles:
- `AppError` subclasses → use `statusCode` + `errorCode` from the error class
- `HttpException` → standard NestJS HTTP errors
- TypeORM `EntityNotFoundError` → 404
- PostgreSQL `QueryFailedError` → maps PG error codes (23505 unique, 23503 FK, etc.) to HTTP responses

Always extend `AppError` (`@shared/domain/app-error.base`) for domain errors. Each error is one file in `domain/errors/`.

### Repository Conventions

- Existence checks: `repository.exists({ where: {...} })` — not `count() > 0`
- Case-insensitive search: `ILike('%term%')` — not `Like` (PostgreSQL-specific)
- ORM entities: `*.orm-entity.ts` in `infrastructure/entities/`; domain entities: `*.entity.ts` in `domain/entities/`

### Shared Kernel (`src/shared/`)

| Path | Purpose |
|------|---------|
| `domain/app-error.base.ts` | Abstract `AppError` base class |
| `domain/errors/` | `not-found`, `conflict`, `unauthorized`, `forbidden`, `validation` errors |
| `domain/contracts/paginated-result.contract.ts` | `PaginatedResult<T>` |
| `application/contracts/auth-user-data.contract.ts` | `AuthUserData` |
| `application/contracts/auth-user-service.contract.ts` | `IAuthUserService` |
| `application/tokens/auth-user-service.token.ts` | `AUTH_USER_SERVICE` |
| `presentation/guards/jwt-auth.guard.ts` | `JwtAuthGuard` (global) |
| `presentation/decorators/public.decorator.ts` | `@Public()` |
| `presentation/decorators/current-tenant.decorator.ts` | `@CurrentTenant()` |
| `presentation/http-exception.filter.ts` | `GlobalHttpExceptionFilter` |

### Architecture Rules (Critical)

- **One class/interface/enum per file.** Only barrels (`index.ts`) may re-export multiple things.
- **No relative cross-module imports.** Use `@modules/`, `@shared/`, `@config/`, `@database/` aliases.
- **Modules export tokens, not service classes.**
- Errors always extend `AppError`. Never `throw new Error('string')`.

### Controller Coding Standards (Critical)

Every controller endpoint must follow this exact pattern. No exceptions.

**1. Swagger documentation — every endpoint must have:**
```typescript
@ApiOperation({ summary: '...', description: '...' })
@ApiOkResponse({ type: ResponseDto })          // or @ApiCreatedResponse / @ApiNoContentResponse
@ApiNotFoundResponse({ description: '...' })   // when entity may not be found
@ApiParam({ name: 'id', description: '...' }) // for every path param
@ApiQuery({ name: '...', required: false })    // for every query param
```
Controller class must also have `@ApiBearerAuth('JWT')` alongside `@ApiTags(...)`.

**2. Pagination — always use `ParseIntPipe`, never `Number()` cast:**
```typescript
// ✅ correct
@Query('page', ParseIntPipe) page = 1,
@Query('limit', ParseIntPipe) limit = 20,

// ❌ wrong
@Query('page') page = 1,  // then Number(page) later
```

**3. UUID path params — always use `ParseUUIDPipe`:**
```typescript
@Param('id', ParseUUIDPipe) id: string
```

**4. Command/query instantiation — always assign to a variable first:**
```typescript
// ✅ correct
const query = new ListVendorsQuery(tenantId, search, page, limit);
const result = await this.queryBus.execute<ListVendorsQuery, PaginatedResult<Vendor>>(query);

// ❌ wrong — inline instantiation inside execute()
const result = await this.queryBus.execute(new ListVendorsQuery(tenantId, search, page, limit));
```

**5. State-transition PATCH endpoints — always `@HttpCode(HttpStatus.NO_CONTENT)`:**
```typescript
@Patch(':id/approve')
@HttpCode(HttpStatus.NO_CONTENT)
@ApiNoContentResponse({ description: '...' })
```

**6. POST endpoints — return `CreatedResponseDto` from `@shared/presentation/dtos/created-response.dto`:**
```typescript
// ✅ correct
return new CreatedResponseDto(id);

// ❌ wrong
return { id };
```

**7. DTOs — all properties must have `@ApiProperty` or `@ApiPropertyOptional`:**
- Input DTOs: `@ApiProperty` above each field (with example values)
- Optional/nullable fields: `@ApiPropertyOptional({ nullable: true })`
- Response DTOs: same rules, plus `{ enum: EnumType }` for enum fields and `{ type: [ItemDto] }` for arrays

### Path Aliases

```
@shared/*   → src/shared/*
@config/*   → src/config/*
@database/* → src/database/*
@modules/*  → src/modules/*
```

### Database

- Single consolidated migration: `src/database/migrations/1748000000000-InitialSchema.ts`
- `DB_RUN_MIGRATIONS=true` in `.env` triggers auto-run on startup via `DatabaseModule`
- CLI data source: `src/database/data-source.ts`
- `autoLoadEntities: true` — all `*.orm-entity.ts` files under `infrastructure/entities/` are picked up automatically

### Docker

- `docker-compose.dev.yml` — dev target with source volume + debug port 9229
- Reset DB volume: `docker compose -f docker-compose.dev.yml down -v`

## Available Skills

- `/nestjs-expert` — DI, guards, interceptors, testing
- `/senior-backend` — APIs, auth, optimization
- `/generate-tests` — unit + integration test suites
- `/commit` — conventional commit messages
- `/architecture` — ADR documentation
- `/docker-expert` — Dockerfile/Compose optimization
- `/database-design` — schema and migrations
