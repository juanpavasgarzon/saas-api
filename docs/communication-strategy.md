# Communication Strategy

This document defines the two communication patterns used in this codebase and how to implement each one correctly.

---

## The Core Rule

| Scope | Where contract + token live | Where the implementation lives |
|---|---|---|
| **Intra-module** (between submodules of the same parent module) | `src/modules/{module}/shared/` | Providing submodule's `application/adapters/` |
| **Cross-module** (between separate bounded contexts) | `src/shared/application/` | Providing module's `application/adapters/` |

The goal of this separation is to keep every bounded context agnostic to others, so any module can be extracted into a microservice with minimal changes.

---

## Pattern 1 — Intra-Module Communication

Used when two submodules within the same parent module need to interact.

**Example:** `QuotationsModule` (inside CRM) needs to convert a prospect to a customer, a capability owned by `ProspectsModule` (also inside CRM).

### File layout

```
src/modules/crm/
├── shared/                                          <- intra-CRM shared layer
│   ├── contracts/
│   │   └── prospect-to-customer.contract.ts        <- interface IProspectToCustomerService
│   └── tokens/
│       └── prospect-to-customer.token.ts           <- Symbol PROSPECT_TO_CUSTOMER_SERVICE
│
├── prospects/
│   └── application/
│       └── adapters/
│           └── prospect-to-customer.adapter.ts     <- implements IProspectToCustomerService
│
└── quotations/
    └── application/
        └── event-handlers/
            └── quotation-accepted.event-handler.ts <- injects via PROSPECT_TO_CUSTOMER_SERVICE
```

### Step-by-step

**1. Define the contract in `{module}/shared/contracts/`**

```typescript
// src/modules/crm/shared/contracts/prospect-to-customer.contract.ts
export interface IProspectToCustomerService {
  convert(prospectId: string, tenantId: string): Promise<string>;
}
```

**2. Define the token in `{module}/shared/tokens/`**

```typescript
// src/modules/crm/shared/tokens/prospect-to-customer.token.ts
export const PROSPECT_TO_CUSTOMER_SERVICE = Symbol('PROSPECT_TO_CUSTOMER_SERVICE');
```

**3. Create the adapter in the providing submodule**

The adapter bridges the shared interface with the submodule's internal logic. It is the only file that knows both the shared contract and the internal domain.

```typescript
// src/modules/crm/prospects/application/adapters/prospect-to-customer.adapter.ts
import { IProspectToCustomerService } from '@modules/crm/shared/contracts/prospect-to-customer.contract';

@Injectable()
export class ProspectToCustomerAdapter implements IProspectToCustomerService {
  constructor(
    @Inject(PROSPECT_REPOSITORY) private readonly prospectRepo: IProspectRepository,
    @Inject(CUSTOMER_REPOSITORY) private readonly customerRepo: CustomerRepository,
  ) {}

  async convert(prospectId: string, tenantId: string): Promise<string> { ... }
}
```

**4. Provide and export the token in the providing submodule**

```typescript
// src/modules/crm/prospects/prospects.module.ts
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([...]), CustomersModule],
  providers: [
    { provide: PROSPECT_REPOSITORY, useClass: ProspectTypeOrmRepository },
    { provide: PROSPECT_TO_CUSTOMER_SERVICE, useClass: ProspectToCustomerAdapter },
  ],
  exports: [PROSPECT_REPOSITORY, PROSPECT_TO_CUSTOMER_SERVICE],
})
export class ProspectsModule {}
```

**5. Import the module and inject by token in the consuming submodule**

```typescript
// src/modules/crm/quotations/quotations.module.ts
@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([...]), ProspectsModule],
  ...
})
export class QuotationsModule {}
```

```typescript
// src/modules/crm/quotations/application/event-handlers/quotation-accepted.event-handler.ts
import { IProspectToCustomerService } from '@modules/crm/shared/contracts/prospect-to-customer.contract';
import { PROSPECT_TO_CUSTOMER_SERVICE } from '@modules/crm/shared/tokens/prospect-to-customer.token';

@EventsHandler(QuotationAcceptedEvent)
export class QuotationAcceptedEventHandler {
  constructor(
    @Inject(PROSPECT_TO_CUSTOMER_SERVICE)
    private readonly prospectToCustomer: IProspectToCustomerService,
  ) {}
}
```

### What the consuming submodule is allowed to import

| Allowed | Not allowed |
|---|---|
| `@modules/crm/shared/contracts/...` | `@modules/crm/prospects/application/...` |
| `@modules/crm/shared/tokens/...` | `@modules/crm/prospects/domain/...` |

The consuming submodule only ever sees the shared interface and token — never the providing submodule's internals.

---

## Pattern 2 — Cross-Module Communication (Service Injection)

Used when a module needs a capability from a completely different bounded context.

**Example:** `AuthModule` (inside Identity) needs to validate user credentials owned by `UsersModule` (also inside Identity, but the contract is cross-module because Auth could become its own service).

### File layout

```
src/shared/
└── application/
    ├── contracts/
    │   └── auth-user-service.contract.ts   <- interface IAuthUserService
    └── tokens/
        └── auth-user-service.token.ts      <- Symbol AUTH_USER_SERVICE

src/modules/identity/
└── users/
    └── application/
        └── adapters/
            └── auth-user.adapter.ts        <- implements IAuthUserService
```

### Step-by-step

**1. Define contract and token in `src/shared/application/`**

```typescript
// src/shared/application/contracts/auth-user-service.contract.ts
export interface IAuthUserService {
  createUser(tenantId: string, email: string, password: string, role?: string): Promise<string>;
  validateCredentials(email: string, password: string): Promise<AuthUserData | null>;
  getUserById(id: string): Promise<AuthUserData | null>;
}
```

```typescript
// src/shared/application/tokens/auth-user-service.token.ts
export const AUTH_USER_SERVICE = Symbol('AUTH_USER_SERVICE');
```

**2. Create the adapter in the providing module**

```typescript
// src/modules/identity/users/application/adapters/auth-user.adapter.ts
import { IAuthUserService } from '@shared/application/contracts/auth-user-service.contract';

@Injectable()
export class AuthUserAdapter implements IAuthUserService {
  constructor(private readonly userService: UserService) {}

  async validateCredentials(email: string, password: string): Promise<AuthUserData | null> {
    const user = await this.userService.validateCredentials(email, password);
    // maps internal User entity to the shared AuthUserData shape
    return user ? { id: user.id, tenantId: user.tenantId, ... } : null;
  }
}
```

**3. Provide and export the token**

```typescript
// src/modules/identity/users/users.module.ts
@Module({
  providers: [
    UserService,
    { provide: AUTH_USER_SERVICE, useClass: AuthUserAdapter },
  ],
  exports: [AUTH_USER_SERVICE, HASH_SERVICE],
})
export class UsersModule {}
```

**4. Import the module and inject by token**

```typescript
// src/modules/identity/auth/auth.module.ts
@Module({
  imports: [UsersModule],
  ...
})
export class AuthModule {}
```

```typescript
// src/modules/identity/auth/application/services/auth.service.ts
import { IAuthUserService } from '@shared/application/contracts/auth-user-service.contract';
import { AUTH_USER_SERVICE } from '@shared/application/tokens/auth-user-service.token';

export class AuthService {
  constructor(
    @Inject(AUTH_USER_SERVICE)
    private readonly userService: IAuthUserService,
  ) {}
}
```

---

## Pattern 3 — Cross-Module Communication (Integration Events)

Used when a module needs to **notify** other modules about something that happened, without knowing who is listening. This is the fully decoupled pattern — the publishing module has zero knowledge of the consumer.

**Example:** When a quotation is accepted in CRM, the Sales module must automatically create a sale. CRM does not import Sales.

### File layout

```
src/shared/
└── application/
    └── events/
        └── quotation-accepted.integration-event.ts   <- shared event class

src/modules/crm/
└── quotations/
    └── application/
        └── event-handlers/
            └── quotation-accepted.event-handler.ts   <- publishes the integration event

src/modules/sales/
└── sales/
    └── application/
        └── event-handlers/
            └── quotation-accepted.integration-event-handler.ts  <- handles it
```

### Step-by-step

**1. Define the integration event in `src/shared/application/events/`**

The event is a plain class. It carries only primitive data — no domain objects.

```typescript
// src/shared/application/events/quotation-accepted.integration-event.ts
export class QuotationAcceptedIntegrationEvent {
  constructor(
    public readonly quotationId: string,
    public readonly tenantId: string,
    public readonly customerId: string,
    public readonly items: Array<{ description: string; quantity: number; ... }>,
  ) {}
}
```

**2. Publish the event from the originating module**

```typescript
// crm/quotations/application/event-handlers/quotation-accepted.event-handler.ts
import { QuotationAcceptedIntegrationEvent } from '@shared/application/events/quotation-accepted.integration-event';

@EventsHandler(QuotationAcceptedEvent)           // handles the DOMAIN event
export class QuotationAcceptedEventHandler {
  constructor(private readonly eventBus: EventBus) {}

  handle(event: QuotationAcceptedEvent): void {
    this.eventBus.publish(
      new QuotationAcceptedIntegrationEvent(      // publishes the INTEGRATION event
        event.quotationId,
        event.tenantId,
        event.customerId,
        event.items,
      ),
    );
  }
}
```

**3. Handle the event in the consuming module**

```typescript
// sales/sales/application/event-handlers/quotation-accepted.integration-event-handler.ts
import { QuotationAcceptedIntegrationEvent } from '@shared/application/events/quotation-accepted.integration-event';

@EventsHandler(QuotationAcceptedIntegrationEvent)
export class QuotationAcceptedIntegrationEventHandler {
  constructor(private readonly commandBus: CommandBus) {}

  handle(event: QuotationAcceptedIntegrationEvent): void {
    this.commandBus.execute(new CreateSaleFromQuotationCommand(...));
  }
}
```

The consuming module imports nothing from CRM. It only imports from `@shared/`.

### Two-level event flow

Domain events and integration events serve different purposes:

```
quotation.accept()
  │
  ├─ apply(QuotationAcceptedEvent)           <- DOMAIN event (in-memory, same aggregate)
  │   │
  │   └─ publisher.mergeObjectContext(q)
  │       quotation.commit()
  │           │
  │           └─ EventBus → QuotationAcceptedEventHandler   <- handles domain event
  │                           │
  │                           └─ EventBus.publish(QuotationAcceptedIntegrationEvent)
  │                                           │
  │                                           └─ QuotationAcceptedIntegrationEventHandler
  │                                               (inside SalesModule)
  │                                               │
  │                                               └─ CreateSaleFromQuotationCommand
```

### Critical: Shared EventBus with `CqrsModule.forRoot()`

For integration events to flow across module boundaries, all modules must share the **same** `EventBus` instance. If each module imports `CqrsModule` independently, separate EventBus instances are created and integration events published in one module will never reach handlers in another module.

**Solution:** Import `CqrsModule.forRoot()` once in `AppModule`. This makes `EventBus`, `CommandBus`, and `QueryBus` global singletons. Submodules that import `CqrsModule` (without `forRoot()`) will reuse the same instances.

```typescript
// src/app.module.ts
@Module({
  imports: [
    CqrsModule.forRoot(),   // ← REQUIRED: makes buses global singletons
    DatabaseModule,
    IdentityModule,
    CrmModule,
    SalesModule,
    // ...
  ],
})
export class AppModule {}
```

**Rule:** `CqrsModule.forRoot()` must appear exactly once in `AppModule`. All other modules use plain `CqrsModule` (without `forRoot()`).

### Correct aggregate event lifecycle in handlers

When a command handler applies domain events, the order of operations matters:

```typescript
// ✅ Correct order
this.publisher.mergeObjectContext(aggregate);  // 1. wire EventBus BEFORE calling domain method
aggregate.accept();                             // 2. domain method applies the event internally
await this.repository.save(aggregate);          // 3. persist
aggregate.commit();                             // 4. dispatch accumulated events to EventBus

// ❌ Wrong order — events are lost
aggregate.accept();                             // domain method fires with no EventBus wired
this.publisher.mergeObjectContext(aggregate);   // too late
await this.repository.save(aggregate);
aggregate.commit();                             // nothing to dispatch
```

| Event type | Scope | Defined in | Triggered by |
|---|---|---|---|
| Domain event | Single aggregate | `{submodule}/domain/events/` | `aggregate.apply()` + `commit()` |
| Integration event | Cross-module | `src/shared/application/events/` | `EventBus.publish()` in a domain event handler |

---

## Summary: What goes where

```
src/shared/
└── application/
    ├── contracts/    <- cross-module service interfaces
    ├── tokens/       <- cross-module injection tokens (Symbols)
    └── events/       <- integration events (cross-module notifications)

src/modules/{module}/
└── shared/
    ├── contracts/    <- intra-module service interfaces
    └── tokens/       <- intra-module injection tokens

src/modules/{module}/{submodule}/
└── application/
    ├── adapters/     <- implements shared contracts (both cross and intra)
    └── event-handlers/
        ├── *.event-handler.ts              <- handles domain events, may publish integration events
        └── *.integration-event-handler.ts  <- handles integration events from other modules
```

---

## Checklist before adding a new inter-module dependency

1. **Is the consumer in the same parent module as the provider?**
   - Yes → use Pattern 1 (intra-module). Contract + token go in `{module}/shared/`.
   - No → use Pattern 2 or 3 (cross-module). Contract + token go in `src/shared/`.

2. **Does the consumer need a synchronous response?**
   - Yes → use service injection (Pattern 1 or 2). Inject via token.
   - No → use integration events (Pattern 3). Publish to `EventBus`.

3. **Does the adapter import any service class from the providing module directly?**
   - Never. The adapter must use only the providing module's own tokens (from its `domain/tokens/`) and its domain entities. It never imports another module's service class.

---

## Strict Enforcement Rules

These rules are **non-negotiable** and apply to every new feature, refactor, or bug fix.

### ❌ Violations — never do this

| Violation | Why it's wrong |
|---|---|
| Import a service class from another module directly | Creates tight coupling; the providing module's internals leak into consumers |
| Put a domain event in `src/shared/` | Domain events are internal to their aggregate and module; they must never cross module boundaries |
| Put an integration event in `{module}/shared/` | Integration events cross module boundaries; they belong in `src/shared/application/events/` |
| Put a cross-module contract in `{module}/shared/` | Cross-module contracts must be in `src/shared/application/contracts/` |
| Inject a QueryBus query from another module in a handler | This silently bypasses the contract boundary; use adapter + token instead |
| Use a domain event to trigger logic in a different parent module | Domain events are intra-module only; use integration events for cross-module triggers |

### ✅ Quick decision table

```
Need to call another submodule's logic (same parent module)?
  → Pattern 1: contract + token in {module}/shared/, adapter in providing submodule

Need to call another parent module's logic (synchronous)?
  → Pattern 2: contract + token in src/shared/application/, adapter in providing module

Need to notify another parent module (fire-and-forget)?
  → Pattern 3: integration event in src/shared/application/events/

Something happened inside a submodule (intra-aggregate reaction)?
  → Domain event in {submodule}/domain/events/ — never shared outside the parent module
```

### Naming conventions

| Artifact | Convention | Example |
|---|---|---|
| Domain event | `{Action}Event` | `PurchaseRequestApprovedEvent` |
| Integration event | `{Action}IntegrationEvent` | `QuotationAcceptedIntegrationEvent` |
| Intra-module contract | `I{Capability}Service` in `{module}/shared/contracts/` | `IProspectToVendorService` |
| Cross-module contract | `I{Capability}Service` in `src/shared/application/contracts/` | `ICompanyProfileService` |
| Adapter | `{Capability}Adapter` in providing module's `application/adapters/` | `ProspectToCustomerAdapter` |
| Domain event handler | `{Action}EventHandler` | `PurchaseRequestApprovedEventHandler` |
| Integration event handler | `{Action}IntegrationEventHandler` | `QuotationAcceptedIntegrationEventHandler` |
