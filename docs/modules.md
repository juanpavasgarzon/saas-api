# Modules Reference

## Identity Module

**Submodules:** auth, users, invitations

### User
Fields: `id`, `tenantId`, `email`, `role` (OWNER|ADMIN|USER), `isActive`, `hashedPassword`

Business rules:
- `activate()` / `deactivate()` — idempotency guard (ConflictError if already in target state)
- Self-deactivation forbidden — `DeactivateUserHandler` checks `userId !== requesterId`
- Password hashed via `HASH_SERVICE` token (bcrypt adapter)

Status flow: `ACTIVE ↔ INACTIVE`
- Deactivate: `DELETE /identity/users/:id`
- Reactivate: `PATCH /identity/users/:id/activate`

### Invitation
Fields: `id`, `tenantId`, `email`, `token` (UUID), `status` (PENDING|ACCEPTED|EXPIRED), `role`

Flow:
1. `POST /identity/invitations/send` → creates invitation + sends email
2. `PATCH /identity/invitations/:token/accept` → `@Public()` — activates user account

---

## Organization Module

**Submodules:** companies, employees, assets

### Company
Fields: `id`, `tenantId`, `name`, `plan` (STARTER|PROFESSIONAL|ENTERPRISE), `logoUrl?`
- One company per tenant
- `PUT /organization/companies` — update profile
- `POST /organization/companies/logo` — upload logo (multipart/form-data)

### Employee
Fields: `id`, `tenantId`, `firstName`, `lastName`, `email`, `position`, `department`, `status` (ACTIVE|INACTIVE|ON_LEAVE), `hiredAt`, `basicSalary`

Status flow: `ACTIVE ↔ INACTIVE`, `ACTIVE → ON_LEAVE`
- Deactivate: `DELETE /organization/employees/:id`
- Reactivate: `PATCH /organization/employees/:id/activate`

Cross-module: exports `EMPLOYEE_STATUS_SERVICE` and `EMPLOYEE_SALARY_SERVICE` tokens (used by Finance/Payroll)

### Asset
Fields: `id`, `tenantId`, `name`, `serialNumber?`, `category` (EQUIPMENT|VEHICLE|FURNITURE|TECHNOLOGY|OTHER), `status` (ACTIVE|ASSIGNED|RETIRED), `assignedEmployeeId?`, `purchaseDate?`, `purchasePrice?`

Flow: `ACTIVE → ASSIGNED` (assign to employee) → `ACTIVE` (return) → `RETIRED`

---

## CRM Module

**Submodules:** customers, prospects, quotations

### Customer
Fields: `id`, `tenantId`, `name`, `email`, `phone?`, `address?`, `isActive`

- `activate()` / `deactivate()` — idempotency guards
- Created automatically when a prospect is converted (via `QuotationAcceptedEvent` flow) or directly

### Prospect (customer prospect)
Fields: `id`, `tenantId`, `name`, `email?`, `phone?`, `company?`, `status` (NEW|CONTACTED|QUALIFIED|LOST|CONVERTED), `source` (REFERRAL|WEBSITE|COLD_CALL|SOCIAL_MEDIA|OTHER)

- `PATCH /crm/prospects/:id/status` — advance status
- On quotation accepted: prospect auto-converted to customer

### Quotation
Fields: `id`, `tenantId`, `number` (sequential), `status` (DRAFT|SENT|ACCEPTED|REJECTED|EXPIRED), `customerId?`, `prospectId?`, `items[]`, `subtotal`, `total`, `notes?`

Status flow:
```
DRAFT → SENT → ACCEPTED → (auto-creates Sale)
              → REJECTED
SENT  → EXPIRED
```
- `PATCH /crm/quotations/:id/send` — optionally emails PDF to customer/prospect
- `GET /crm/quotations/:id/pdf` — download PDF
- On ACCEPTED: publishes `QuotationAcceptedIntegrationEvent` → Sales creates a Sale

---

## Sales Module

**Submodules:** sales (orders), invoices

### Sale
Fields: `id`, `tenantId`, `number`, `status` (DRAFT|APPROVED|CANCELLED), `customerId`, `items[]`, `total`

Status flow: `DRAFT → APPROVED → (auto-creates Invoice)`, `DRAFT/APPROVED → CANCELLED`
- On APPROVED: publishes `SaleApprovedIntegrationEvent` → Inventory can register EXIT movements
- `GET /sales/orders/:id/pdf` — download PDF

### Invoice
Fields: `id`, `tenantId`, `number`, `status` (DRAFT|SENT|PAID|CANCELLED), `customerId`, `saleId`, `items[]`, `total`, `dueDate?`

Status flow: `DRAFT → SENT → PAID`, `any → CANCELLED`
- Created automatically when a Sale is approved
- `GET /sales/invoices/:id/pdf` — download PDF

---

## Finance Module

**Submodules:** payroll, accounting

### PayrollEntry
Fields: `id`, `tenantId`, `employeeId`, `period` (YYYY-MM), `status` (PENDING|PAID), `daysWorked`, `basicSalary`, `bonuses`, `deductions`, `netPay`, `paidAt?`

- `PATCH /finance/payroll/:id/pay` — mark as paid
- `GET /finance/payroll/:id/pdf` — download pay stub PDF
- Uses `EMPLOYEE_SALARY_SERVICE` (cross-module, reads from Organization)

### AccountingTransaction
Fields: `id`, `tenantId`, `type` (INCOME|EXPENSE), `amount`, `description`, `reference?`, `date`

- Immutable once created
- `GET /finance/accounting/transactions/:id/pdf` — download receipt PDF

---

## Projects Module

**Submodule:** projects

### Project
Fields: `id`, `tenantId`, `name`, `description?`, `status` (PLANNING|ACTIVE|ON_HOLD|COMPLETED|CANCELLED), `customerId?`, `startDate?`, `endDate?`, `budget?`, `members[]`

Member roles: LEAD | MEMBER | VIEWER

Member management via inline JSON body on create/update:
```json
{ "members": [{ "employeeId": "uuid", "role": "LEAD" }] }
```
- `PUT /projects/:id` — full-replace member list (reconcile: add new, remove missing)
- `PATCH /projects/:id/status` — transition status

---

## Inventory Module

**Submodules:** products, warehouses, stock, movements

### Product
Fields: `id`, `tenantId`, `name`, `sku` (unique per tenant), `description?`, `unit`, `category?`, `isActive`

- `activate()` / `deactivate()` — idempotency guards
- `DELETE /inventory/products/:id` — deactivate
- `PATCH /inventory/products/:id/activate` — reactivate

### Warehouse
Fields: `id`, `tenantId`, `name`, `location?`, `isActive`

- `activate()` / `deactivate()` — idempotency guards

### Stock
Fields: `id`, `tenantId`, `productId`, `warehouseId`, `quantity`, `reservedQuantity`

- Read-only via API — managed automatically by RegisterMovementHandler
- `availableQuantity = quantity - reservedQuantity`
- `subtractQuantity(qty)` throws ConflictError if insufficient stock

### Movement
Fields: `id`, `tenantId`, `productId`, `warehouseId?`, `type` (ENTRY|EXIT|TRANSFER), `quantity`, `referenceId?`, `notes?`, `createdAt`

- Immutable once created
- RegisterMovementHandler automatically upserts Stock record
- Integration event handlers create movements when `productId` is provided

---

## Procurement Module

**Submodules:** vendors, prospects, purchase-requests, purchase-orders

### Vendor
Fields: `id`, `tenantId`, `name`, `email`, `phone?`, `address?`, `isActive`
- Converted from a Prospect when a PurchaseRequest is approved

### Prospect (vendor prospect)
Fields: `id`, `tenantId`, `name`, `email?`, `phone?`, `company?`, `notes?`
- Route: `POST /procurement/prospects`
- Converted to Vendor when linked PurchaseRequest is approved

### PurchaseRequest
Fields: `id`, `tenantId`, `status` (DRAFT|PENDING_REVIEW|APPROVED|REJECTED), `prospectId?`, `items[]`, `totalAmount`, `justification?`

Status flow:
```
DRAFT → PENDING_REVIEW → APPROVED → (auto-creates PurchaseOrder + converts Prospect to Vendor)
                       → REJECTED
```
- On APPROVED: `PurchaseRequestApprovedEvent` → converts VendorProspect to Vendor + creates PurchaseOrder

### PurchaseOrder
Fields: `id`, `tenantId`, `status` (PENDING|RECEIVED|CANCELLED), `vendorId`, `purchaseRequestId`, `items[]`

Status flow: `PENDING → RECEIVED`, `PENDING → CANCELLED`
- On RECEIVED: publishes `PurchaseOrderReceivedIntegrationEvent` → Inventory registers ENTRY movements
- `PATCH /procurement/purchase-orders/:id/receive` — mark as received
