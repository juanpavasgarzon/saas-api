# Integration Events

Integration events are the cross-module notification mechanism (fire-and-forget).
All integration event classes live in `src/shared/application/events/`.

Full pattern reference: `docs/communication-strategy.md` — Pattern 3.

---

## Event: QuotationAcceptedIntegrationEvent

**File:** `src/shared/application/events/quotation-accepted.integration-event.ts`

**Published by:** CRM / Quotations
**Trigger:** `quotation.accept()` → domain event `QuotationAcceptedEvent` → `QuotationAcceptedEventHandler` publishes this

**Payload:**
```typescript
quotationId: string
tenantId: string
customerId: string
items: Array<{ description, quantity, unit, unitPrice, lineTotal }>
```

**Consumed by:** Sales
**Handler:** `sales/sales/application/event-handlers/quotation-accepted.integration-event-handler.ts`
**Action:** Executes `CreateSaleFromQuotationCommand` → creates a Sale in DRAFT status

---

## Event: SaleApprovedIntegrationEvent

**File:** `src/shared/application/events/sale-approved.integration-event.ts`

**Published by:** Sales
**Trigger:** `sale.approve()` → domain event `SaleApprovedEvent` → `SaleApprovedEventHandler` publishes this
*(Note: `SaleApprovedEventHandler` also creates the Invoice as a side effect)*

**Payload:**
```typescript
saleId: string
tenantId: string
items: Array<{ productId: string | null, description: string, quantity: number }>
```

**Consumed by:** Inventory
**Handler:** `inventory/movements/application/event-handlers/sale-approved.integration-event-handler.ts`
**Action:** For each item where `productId` is not null → executes `RegisterMovementCommand` with type=EXIT

> **Note:** Current sale items do not carry `productId`. Set `productId` on sale items to enable automatic stock deduction.

---

## Event: PurchaseOrderReceivedIntegrationEvent

**File:** `src/shared/application/events/purchase-order-received.integration-event.ts`

**Published by:** Procurement / PurchaseOrders
**Trigger:** `order.receive()` → domain event `PurchaseOrderReceivedEvent` → `PurchaseOrderReceivedEventHandler` publishes this

**Payload:**
```typescript
purchaseOrderId: string
tenantId: string
items: Array<{ productId: string | null, description: string, quantity: number }>
```

**Consumed by:** Inventory
**Handler:** `inventory/movements/application/event-handlers/purchase-order-received.integration-event-handler.ts`
**Action:** For each item where `productId` is not null → executes `RegisterMovementCommand` with type=ENTRY

---

## Two-Level Event Flow

Domain events are internal to their submodule. Integration events cross module boundaries:

```
[Domain Event]                    [Integration Event]
──────────────                    ──────────────────
Lives in: {submodule}/domain/events/     Lives in: src/shared/application/events/
Fired by: aggregate.apply() + commit()   Fired by: domain event handler (EventBus.publish)
Scope: intra-submodule only              Scope: any module can subscribe
```

### Full chain example (Quotation → Sale → Invoice → Inventory)

```
PATCH /crm/quotations/:id/accept
  │
  └─ AcceptQuotationHandler
       publisher.mergeObjectContext(quotation)
       quotation.accept()              ← applies QuotationAcceptedEvent
       repository.save(quotation)
       quotation.commit()              ← dispatches to EventBus
           │
           └─ QuotationAcceptedEventHandler   (CRM module)
                eventBus.publish(QuotationAcceptedIntegrationEvent)
                    │
                    └─ QuotationAcceptedIntegrationEventHandler   (Sales module)
                         commandBus.execute(CreateSaleFromQuotationCommand)
                             │
                             └─ Sale created in DRAFT status

PATCH /sales/orders/:id/approve
  │
  └─ ApproveSaleHandler
       publisher.mergeObjectContext(sale)
       sale.approve()                  ← applies SaleApprovedEvent
       repository.save(sale)
       sale.commit()
           │
           └─ SaleApprovedEventHandler   (Sales module)
                commandBus.execute(CreateInvoiceFromSaleCommand)  ← creates Invoice
                eventBus.publish(SaleApprovedIntegrationEvent)
                    │
                    └─ SaleApprovedIntegrationEventHandler   (Inventory module)
                         RegisterMovement(EXIT) per item with productId

PATCH /procurement/purchase-orders/:id/receive
  │
  └─ ReceivePurchaseOrderHandler
       publisher.mergeObjectContext(order)
       order.receive()                 ← applies PurchaseOrderReceivedEvent
       repository.save(order)
       order.commit()
           │
           └─ PurchaseOrderReceivedEventHandler   (Procurement module)
                eventBus.publish(PurchaseOrderReceivedIntegrationEvent)
                    │
                    └─ PurchaseOrderReceivedIntegrationEventHandler   (Inventory module)
                         RegisterMovement(ENTRY) per item with productId
```

---

## Adding a New Integration Event

1. Create class in `src/shared/application/events/{action}.integration-event.ts`
2. In the publishing module's domain event handler, inject `EventBus` and call `this.eventBus.publish(new XxxIntegrationEvent(...))`
3. In the consuming module, create `{action}.integration-event-handler.ts` with `@EventsHandler(XxxIntegrationEvent)`
4. Register the handler in the consuming submodule's `providers` array
