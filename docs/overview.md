# Project Overview

## Business Idea

Multi-tenant SaaS API platform for SMBs to manage their entire business operation from a single backend:

- **Identity & Access** — Multi-tenant user management with invitation flow and RBAC (OWNER / ADMIN / USER)
- **CRM** — Full customer lifecycle: prospect → customer → quotation → sale, with PDF + email delivery
- **Sales** — Sales orders and invoices with automatic creation from accepted quotations
- **Procurement** — Vendor management, purchase requests with approval flow, purchase orders
- **Inventory** — Product catalog, warehouses, real-time stock levels, movement tracking
- **Finance** — Payroll entries (pay stub PDFs) and accounting transactions (receipt PDFs)
- **Projects** — Project management with inline team member assignment
- **Organization** — Company profile, employees lifecycle, asset management

## Tenant Lifecycle

```
1. POST /identity/auth/register   → creates tenant + OWNER user
2. POST /identity/auth/login      → returns JWT { id, tenantId, email, role }
3. POST /identity/invitations/send → sends invitation email
4. PATCH /identity/invitations/:token/accept → member activates account (@Public)
5. Every request: JWT carries tenantId → all data automatically scoped
```

## Technology Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js + TypeScript |
| Framework | NestJS 10 |
| ORM | TypeORM |
| Database | PostgreSQL |
| Pattern | DDD + CQRS (CommandBus / QueryBus / EventBus) |
| Auth | JWT (HS256) |
| API Docs | Swagger / OpenAPI (`/api/docs`) |
| PDF | PDFKit |
| Email | Nodemailer |
| Container | Docker multi-stage Alpine |

## Role Permissions

| Scope | OWNER | ADMIN | USER |
|---|---|---|---|
| All operations | ✅ | — | — |
| Create / modify / remove | ✅ | ✅ | — |
| Read + downloads | ✅ | ✅ | ✅ |
| Deactivate / reactivate accounts | ✅ | ✅ | — |
