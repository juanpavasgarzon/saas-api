# Database Schema

## Configuration

- **Engine:** PostgreSQL
- **ORM:** TypeORM with `autoLoadEntities: true`
- **Migrations:** `src/database/migrations/` — run via `DB_RUN_MIGRATIONS=true` in `.env`
- **CLI datasource:** `src/database/data-source.ts`
- **ORM entities glob:** `/../modules/**/infrastructure/entities/*.orm-entity{.ts,.js}`

## Running Migrations

```bash
# Generate new migration
npm run migration:generate -- src/database/migrations/MigrationName

# Run pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Migration Files

| File | Tables created |
|---|---|
| `1748000000000-CreateCompanies` | companies (plan enum) |
| `1748000001000-CreateUsers` | users (role enum) |
| `1748000002000-CreateEmployees` | employees (status enum) |
| `1748000003000-CreateCustomers` | customers |
| `1748000004000-CreateInvitations` | invitations (status enum) |
| `1748000005000-CreateProjects` | projects (status enum) |
| `1748000006000-CreateProjectMembers` | project_members (role enum) |
| `1748000007000-CreatePayrollEntries` | payroll_entries (status enum) |
| `1748000008000-CreateAccountingTransactions` | accounting_transactions (type enum) |
| `1748000009000-CreateCustomerProspects` | customer_prospects (status + source enums) |
| `1748000010000-CreateQuotations` | quotations + quotation_items (status + unit_of_measure enums) |
| `1748000011000-CreateSales` | sales + sale_items (status enum) |
| `1748000012000-CreateInvoices` | invoices + invoice_items (status enum) |
| `1748000013000-CreateVendors` | vendors |
| `1748000014000-CreateVendorProspects` | vendor_prospects |
| `1748000015000-CreatePurchaseRequests` | purchase_requests + purchase_request_items (status enum) |
| `1748000016000-CreatePurchaseOrders` | purchase_orders + purchase_order_items (status enum) |
| `1748000017000-CreateAssets` | assets + asset_assignments (status + category enums) |
| `1748000018000-AddEmployeeSalaryAndPayrollDaysWorked` | ALTER employees + payroll_entries |
| `1748000019000-CreateInventory` | inventory_products, inventory_warehouses, inventory_stock, inventory_movements |

## Tables Reference

### Identity

**users**
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| tenantId | varchar | |
| email | varchar | unique per tenant |
| role | enum | OWNER \| ADMIN \| USER |
| hashedPassword | varchar | bcrypt |
| isActive | boolean | default true |
| createdAt / updatedAt | timestamp | |

**invitations**
| Column | Type | Notes |
|---|---|---|
| id | uuid PK | |
| tenantId | varchar | |
| email | varchar | |
| token | uuid | unique, used in accept URL |
| status | enum | PENDING \| ACCEPTED \| EXPIRED |
| role | enum | ADMIN \| USER |
| createdAt / updatedAt | timestamp | |

### Organization

**companies**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar unique |
| name | varchar |
| plan | enum STARTER\|PROFESSIONAL\|ENTERPRISE |
| logoUrl | varchar nullable |

**employees**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| firstName / lastName | varchar |
| email | varchar |
| position / department | varchar |
| status | enum ACTIVE\|INACTIVE\|ON_LEAVE |
| hiredAt | date |
| basicSalary | decimal(12,2) |

**assets**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| name | varchar |
| serialNumber | varchar nullable |
| category | enum EQUIPMENT\|VEHICLE\|FURNITURE\|TECHNOLOGY\|OTHER |
| status | enum ACTIVE\|ASSIGNED\|RETIRED |
| assignedEmployeeId | uuid nullable FK → employees |
| purchaseDate | date nullable |
| purchasePrice | decimal nullable |

### CRM

**customers**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| name / email | varchar |
| phone / address | varchar nullable |
| isActive | boolean |

**customer_prospects**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| name / email | varchar |
| status | enum NEW\|CONTACTED\|QUALIFIED\|LOST\|CONVERTED |
| source | enum REFERRAL\|WEBSITE\|COLD_CALL\|SOCIAL_MEDIA\|OTHER |

**quotations** + **quotation_items**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| number | integer sequential |
| status | enum DRAFT\|SENT\|ACCEPTED\|REJECTED\|EXPIRED |
| customerId | uuid nullable FK |
| prospectId | uuid nullable FK |
| subtotal / total | decimal |
| validUntil | date nullable |

quotation_items: description, quantity, unit (unit_of_measure_enum), unitPrice, lineTotal

### Sales

**sales** + **sale_items** — same structure as quotations (status: DRAFT\|APPROVED\|CANCELLED)

**invoices** + **invoice_items** — (status: DRAFT\|SENT\|PAID\|CANCELLED), dueDate, saleId FK

### Finance

**payroll_entries**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| employeeId | uuid FK |
| period | varchar (YYYY-MM) |
| status | enum PENDING\|PAID |
| daysWorked | integer |
| basicSalary / bonuses / deductions / netPay | decimal |
| paidAt | timestamp nullable |

**accounting_transactions**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| type | enum INCOME\|EXPENSE |
| amount | decimal |
| description | varchar |
| reference | varchar nullable |
| date | date |

### Projects

**projects** — status: PLANNING\|ACTIVE\|ON_HOLD\|COMPLETED\|CANCELLED, customerId FK nullable

**project_members** — projectId FK, employeeId FK, role: LEAD\|MEMBER\|VIEWER

### Procurement

**vendors** — id, tenantId, name, email, phone?, address?, isActive

**vendor_prospects** — id, tenantId, name, email?, phone?, company?, notes?

**purchase_requests** + **purchase_request_items** — status: DRAFT\|PENDING_REVIEW\|APPROVED\|REJECTED

**purchase_orders** + **purchase_order_items** — status: PENDING\|RECEIVED\|CANCELLED, vendorId FK

### Inventory

**inventory_products**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| name | varchar |
| sku | varchar — unique index (tenantId, sku) |
| unit | varchar (e.g. UNIT, KG, L) |
| category | varchar nullable |
| isActive | boolean default true |

**inventory_warehouses** — id, tenantId, name, location?, isActive

**inventory_stock**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| productId | uuid FK → inventory_products |
| warehouseId | uuid FK → inventory_warehouses |
| quantity | decimal(12,4) default 0 |
| reservedQuantity | decimal(12,4) default 0 |
| unique index | (tenantId, productId, warehouseId) |

**inventory_movements**
| Column | Type |
|---|---|
| id | uuid PK |
| tenantId | varchar |
| productId | uuid |
| warehouseId | uuid nullable |
| type | enum ENTRY\|EXIT\|TRANSFER |
| quantity | decimal(12,4) |
| referenceId | varchar nullable (links to saleId / purchaseOrderId) |
| notes | varchar nullable |
| createdAt | timestamp (immutable — no updatedAt) |

## Conventions

- All PKs are UUID v4 generated in application layer (`generateId()`)
- All tables include `tenantId varchar NOT NULL` for multi-tenancy isolation
- Foreign keys are enforced at DB level in most tables
- Enum types are created as PostgreSQL native enums for each table
- `ILike('%term%')` used for case-insensitive search (PostgreSQL-specific)
- Existence checks use `repository.exists({ where: {...} })` — not `count() > 0`
