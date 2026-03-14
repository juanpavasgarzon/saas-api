# Architecture

## Module Hierarchy

```
AppModule
├── IdentityModule        → auth, users, invitations
├── OrganizationModule    → companies, employees, assets
├── CrmModule             → customers, prospects, quotations
├── SalesModule           → sales orders, invoices
├── ProjectsModule        → projects (with inline members)
├── FinanceModule         → payroll, accounting
├── InventoryModule       → products, warehouses, stock, movements
├── ProcurementModule     → vendors, prospects, purchase-requests, purchase-orders
└── InfrastructureModule  → notifications, tenant
```

## DDD Layers (per submodule)

```
domain/
  entities/       ← AggregateRoot subclasses with domain methods + business rules
  contracts/      ← IProps and IRepository interfaces
  enums/          ← domain enumerations
  errors/         ← AppError subclasses (statusCode + errorCode)
  events/         ← domain events (intra-submodule only, never cross boundaries)
  tokens/         ← DI Symbol constants for repository injection

application/
  commands/       ← write side: {action}.command.ts + {action}.handler.ts
  queries/        ← read side:  {action}.query.ts  + {action}.handler.ts
  services/       ← thin facade for controllers that need multiple buses
  adapters/       ← implements shared contracts; bridges between modules
  event-handlers/ ← domain event handlers AND integration event handlers

infrastructure/
  entities/       ← TypeORM ORM entities (*.orm-entity.ts, never @Entity on domain)
  repositories/   ← TypeORM implementations of IRepository contracts
  services/       ← PDF generators, email services, external integrations

presentation/
  controllers/    ← NestJS controllers (HTTP only, no business logic)
  dtos/           ← Input/output DTOs with class-validator + @ApiProperty
```

## CQRS Flow

```
Controller
  → CommandBus.execute(command)
    → CommandHandler
      → Repository.findById()
      → aggregate.domainMethod()   ← business logic lives here
      → Repository.save()
      → aggregate.commit()         ← dispatches domain events

Controller
  → QueryBus.execute(query)
    → QueryHandler
      → Repository.findAll() / findById()
      → map to ResponseDto
```

## Aggregate Event Lifecycle (critical order)

```typescript
// ✅ Correct
this.publisher.mergeObjectContext(aggregate);  // 1. wire EventBus BEFORE domain method
aggregate.domainMethod();                       // 2. applies event via this.apply()
await this.repository.save(aggregate);          // 3. persist
aggregate.commit();                             // 4. dispatch events to EventBus

// ❌ Wrong — events are silently dropped
aggregate.domainMethod();
this.publisher.mergeObjectContext(aggregate);   // too late
await this.repository.save(aggregate);
aggregate.commit();
```

## CqrsModule Setup

`CqrsModule.forRoot()` is imported **once** in `AppModule`. This makes `EventBus`, `CommandBus`, and `QueryBus` global singletons shared across all modules. All submodules import plain `CqrsModule` (without `forRoot()`).

Without `forRoot()`, each module gets its own isolated `EventBus` and integration events cannot cross module boundaries.

## Route Naming Convention

All routes follow `{module}/{submodule}`:

```
/identity/auth          /identity/users        /identity/invitations
/organization/companies /organization/employees /organization/assets
/crm/customers          /crm/prospects         /crm/quotations
/sales/orders           /sales/invoices
/finance/payroll        /finance/accounting
/projects
/inventory/products     /inventory/warehouses  /inventory/stock  /inventory/movements
/procurement/vendors    /procurement/prospects /procurement/purchase-requests /procurement/purchase-orders
```

## Authentication & Authorization

```
JwtAuthGuard (global APP_GUARD, runs first)
  → validates Bearer token
  → extracts { id, tenantId, email, role, isActive } into request.user
  → @Public() decorator skips this guard

PermissionsGuard (global APP_GUARD, runs second)
  → checks @RequirePermission(Permission.Xxx) on the handler
  → looks up ROLE_PERMISSIONS[user.role] and verifies the required permission
  → @CurrentTenant() → extracts tenantId from JWT
  → @CurrentUser()   → extracts userId from JWT
```

## Error Handling

`GlobalHttpExceptionFilter` (registered in `main.ts`) maps all errors to a consistent JSON shape:

| Source | HTTP status |
|---|---|
| `AppError` subclass | error's `statusCode` field |
| `EntityNotFoundError` | 404 |
| `QueryFailedError` code 23505 | 409 (unique constraint) |
| `QueryFailedError` code 23503 | 409 (FK constraint) |
| `HttpException` | standard NestJS status |

## Idempotency Guards on Status Transitions

Domain entities throw `ConflictError` (409) when transitioning to a state they are already in:

| Entity | Method | Guard |
|---|---|---|
| `User` | `activate()` | throws if already active |
| `User` | `deactivate()` | throws if already inactive |
| `Employee` | `activate()` | throws if already ACTIVE |
| `Employee` | `deactivate()` | throws if already INACTIVE |
| `Customer` | `activate()` | throws if already active |
| `Customer` | `deactivate()` | throws if already inactive |
| `Product` | `activate()` | throws if already active |
| `Product` | `deactivate()` | throws if already inactive |
| `Warehouse` | `activate()` | throws if already active |
| `Warehouse` | `deactivate()` | throws if already inactive |

## Cross-Module Communication

Full reference: `docs/communication-strategy.md`

| Scenario | Pattern | Contract location |
|---|---|---|
| Same parent module | Token injection (Pattern 1) | `{module}/shared/contracts/` |
| Different parent module | Token injection (Pattern 2) | `src/shared/application/contracts/` |
| Fire-and-forget notification | Integration event (Pattern 3) | `src/shared/application/events/` |

## Controller Coding Standards

- `@ApiBearerAuth('JWT')` on class + full Swagger decorators on every endpoint
- UUID params: always `@Param('id', ParseUUIDPipe)`
- Pagination: always `@Query('page', ParseIntPipe) page = 1`
- Commands: `const cmd = new XxxCommand(...); await this.commandBus.execute(cmd)` — never inline
- PATCH state transitions: `@HttpCode(HttpStatus.NO_CONTENT)` + `@ApiNoContentResponse`
- POST create: return `new CreatedResponseDto(id)` — never `{ id }`
- All DTO fields: `@ApiProperty` or `@ApiPropertyOptional` with examples
