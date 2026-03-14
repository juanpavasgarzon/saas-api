# API Summary

Base URL: `http://localhost:3000`
All endpoints require `Authorization: Bearer <token>` unless marked **Public**.

---

## Identity

### Auth — `/identity/auth`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/identity/auth/register` | Register tenant + owner user | Public |
| POST | `/identity/auth/login` | Authenticate and get JWT token pair | Public |
| POST | `/identity/auth/refresh` | Refresh access token using refresh token | Public (refresh token) |
| GET | `/identity/auth/me` | Get current user profile and permissions | Bearer |

### Users — `/identity/users`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/identity/users` | List users (paginated; query: page, limit) | Bearer |
| GET | `/identity/users/:id` | Get user by ID | Bearer |
| PATCH | `/identity/users/:id/activate` | Reactivate user (409 if already active) | Bearer |
| DELETE | `/identity/users/:id` | Deactivate user (409 if self or already inactive) | Bearer |

### Invitations — `/identity/invitations`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/identity/invitations` | List pending invitations (paginated) | Bearer |
| POST | `/identity/invitations` | Send invitation email | Bearer |
| POST | `/identity/invitations/:token/accept` | Accept invitation and create account | Public |

---

## Organization

### Companies — `/organization/companies`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/organization/companies` | Get company profile | Bearer |
| PATCH | `/organization/companies` | Update company name | Bearer |
| POST | `/organization/companies/logo` | Upload company logo (multipart/form-data, max 2 MB) | Bearer |

### Employees — `/organization/employees`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/organization/employees` | Create employee | Bearer |
| GET | `/organization/employees` | List employees (query: department, status, search, page, limit) | Bearer |
| GET | `/organization/employees/:id` | Get employee by ID | Bearer |
| PUT | `/organization/employees/:id` | Update employee | Bearer |
| PATCH | `/organization/employees/:id/activate` | Reactivate employee (409 if already active) | Bearer |
| DELETE | `/organization/employees/:id` | Deactivate employee (409 if already inactive) | Bearer |

### Assets — `/organization/assets`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/organization/assets` | Register asset | Bearer |
| GET | `/organization/assets` | List assets (query: status, category, search, page, limit) | Bearer |
| GET | `/organization/assets/:id` | Get asset by ID (includes assignments) | Bearer |
| PUT | `/organization/assets/:id` | Update asset details | Bearer |
| PATCH | `/organization/assets/:id/assign` | Assign asset to employee or project | Bearer |
| PATCH | `/organization/assets/:id/return` | Return assigned asset | Bearer |
| PATCH | `/organization/assets/:id/retire` | Retire asset permanently | Bearer |

---

## CRM

### Customers — `/crm/customers`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/crm/customers` | Create customer | Bearer |
| GET | `/crm/customers` | List customers (query: search, page, limit) | Bearer |
| GET | `/crm/customers/search` | Search customers by name, ID number, contact, or company | Bearer |
| GET | `/crm/customers/:id` | Get customer by ID | Bearer |
| PUT | `/crm/customers/:id` | Update customer | Bearer |
| PATCH | `/crm/customers/:id/activate` | Reactivate customer (409 if already active) | Bearer |
| DELETE | `/crm/customers/:id` | Deactivate customer (409 if already inactive) | Bearer |

### Prospects — `/crm/prospects`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/crm/prospects` | Create prospect | Bearer |
| GET | `/crm/prospects` | List prospects (query: status, search, page, limit) | Bearer |
| GET | `/crm/prospects/search` | Search prospects by name, ID number, contact, or company | Bearer |
| GET | `/crm/prospects/:id` | Get prospect by ID | Bearer |
| PUT | `/crm/prospects/:id` | Update prospect | Bearer |
| PATCH | `/crm/prospects/:id/status` | Update prospect status | Bearer |
| DELETE | `/crm/prospects/:id` | Delete prospect | Bearer |

### Quotations — `/crm/quotations`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/crm/quotations` | Create draft quotation (body: title, customerId?, prospectId?, items[]) | Bearer |
| GET | `/crm/quotations` | List quotations (query: status, customerId, prospectId, page, limit) | Bearer |
| GET | `/crm/quotations/:id` | Get quotation by ID (includes line items) | Bearer |
| GET | `/crm/quotations/:id/pdf` | Download quotation as PDF | Bearer |
| PUT | `/crm/quotations/:id` | Update quotation (DRAFT only) | Bearer |
| PATCH | `/crm/quotations/:id/send` | Send quotation (DRAFT → SENT) | Bearer |
| PATCH | `/crm/quotations/:id/accept` | Accept quotation (SENT → ACCEPTED) | Bearer |
| PATCH | `/crm/quotations/:id/reject` | Reject quotation (SENT → REJECTED) | Bearer |
| PATCH | `/crm/quotations/:id/expire` | Mark quotation as EXPIRED | Bearer |
| DELETE | `/crm/quotations/:id` | Delete quotation (DRAFT only) | Bearer |

---

## Sales

### Sales Orders — `/sales/orders`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/sales/orders` | Create sale (body: customerId, notes?, items[]) | Bearer |
| GET | `/sales/orders` | List sales (query: customerId, status, page, limit) | Bearer |
| GET | `/sales/orders/:id` | Get sale by ID (includes line items) | Bearer |
| GET | `/sales/orders/:id/pdf` | Download sale order as PDF | Bearer |
| PATCH | `/sales/orders/:id/approve` | Approve sale (PENDING → APPROVED; auto-creates invoice) | Bearer |
| PATCH | `/sales/orders/:id/cancel` | Cancel sale (PENDING only) | Bearer |

### Sales Invoices — `/sales/invoices`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/sales/invoices` | List invoices (query: customerId, dealId, status, page, limit) | Bearer |
| GET | `/sales/invoices/:id` | Get invoice by ID (includes line items) | Bearer |
| GET | `/sales/invoices/:id/pdf` | Download invoice as PDF | Bearer |
| PATCH | `/sales/invoices/:id/send` | Send invoice (DRAFT → SENT) | Bearer |
| PATCH | `/sales/invoices/:id/pay` | Mark invoice as paid (SENT → PAID) | Bearer |
| PATCH | `/sales/invoices/:id/cancel` | Cancel invoice (DRAFT or SENT only) | Bearer |

---

## Projects — `/projects`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/projects` | Create project (body: name, description, customerId, budget?, startDate?, endDate?, members[]?) | Bearer |
| GET | `/projects` | List projects (query: customerId, status, search, page, limit) | Bearer |
| GET | `/projects/:id` | Get project by ID (includes members) | Bearer |
| PUT | `/projects/:id` | Update project (replaces members[] entirely) | Bearer |
| PATCH | `/projects/:id/status` | Change project status (body: action) | Bearer |
| DELETE | `/projects/:id` | Delete project | Bearer |

---

## Finance

### Payroll — `/finance/payroll`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/finance/payroll` | Create payroll entry | Bearer |
| GET | `/finance/payroll` | List payroll entries (query: employeeId, period, status, page, limit) | Bearer |
| GET | `/finance/payroll/:id/pdf` | Download pay stub as PDF | Bearer |
| PATCH | `/finance/payroll/:id/pay` | Mark payroll entry as paid | Bearer |

### Accounting — `/finance/accounting`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/finance/accounting/transactions` | Create accounting transaction | Bearer |
| GET | `/finance/accounting/transactions` | List transactions (query: type, dateFrom, dateTo, page, limit) | Bearer |
| GET | `/finance/accounting/transactions/:id/pdf` | Download transaction receipt as PDF | Bearer |

---

## Inventory

### Products — `/inventory/products`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/inventory/products` | Create inventory product | Bearer |
| GET | `/inventory/products` | List products (query: search, isActive, page, limit) | Bearer |
| GET | `/inventory/products/:id` | Get product by ID | Bearer |
| PUT | `/inventory/products/:id` | Update product | Bearer |
| PATCH | `/inventory/products/:id/activate` | Reactivate product (409 if already active) | Bearer |
| DELETE | `/inventory/products/:id` | Deactivate product (409 if already inactive) | Bearer |

### Warehouses — `/inventory/warehouses`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/inventory/warehouses` | Create warehouse | Bearer |
| GET | `/inventory/warehouses` | List warehouses (query: search, isActive, page, limit) | Bearer |
| GET | `/inventory/warehouses/:id` | Get warehouse by ID | Bearer |
| PUT | `/inventory/warehouses/:id` | Update warehouse | Bearer |
| PATCH | `/inventory/warehouses/:id/activate` | Reactivate warehouse (409 if already active) | Bearer |
| DELETE | `/inventory/warehouses/:id` | Deactivate warehouse (409 if already inactive) | Bearer |

### Stock — `/inventory/stock`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/inventory/stock` | List stock entries (query: productId, warehouseId, page, limit) | Bearer |
| GET | `/inventory/stock/:id` | Get stock entry by ID | Bearer |

### Movements — `/inventory/movements`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/inventory/movements` | Register manual movement (type: ENTRY \| EXIT \| TRANSFER; toWarehouseId required for TRANSFER) | Bearer |
| GET | `/inventory/movements` | List movements (query: productId, warehouseId, type, page, limit) | Bearer |
| GET | `/inventory/movements/:id` | Get movement by ID | Bearer |

---

## Procurement

### Suppliers — `/procurement/suppliers`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/procurement/suppliers` | Create supplier | Bearer |
| GET | `/procurement/suppliers` | List suppliers (query: search, page, limit) | Bearer |
| GET | `/procurement/suppliers/:id` | Get supplier by ID | Bearer |
| PUT | `/procurement/suppliers/:id` | Update supplier | Bearer |

### Supplier Prospects — `/procurement/prospects`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/procurement/prospects` | Create supplier prospect | Bearer |
| GET | `/procurement/prospects` | List supplier prospects (query: status, search, page, limit) | Bearer |
| GET | `/procurement/prospects/:id` | Get supplier prospect by ID | Bearer |
| PUT | `/procurement/prospects/:id` | Update supplier prospect | Bearer |
| PATCH | `/procurement/prospects/:id/status` | Update supplier prospect status | Bearer |
| DELETE | `/procurement/prospects/:id` | Delete supplier prospect | Bearer |

### Purchase Requests — `/procurement/requisitions`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/procurement/requisitions` | Create draft purchase request (body: title, supplierId?, supplierProspectId?, notes?, items[]) | Bearer |
| GET | `/procurement/requisitions` | List purchase requests (query: status, supplierId, page, limit) | Bearer |
| GET | `/procurement/requisitions/:id` | Get purchase request by ID | Bearer |
| PATCH | `/procurement/requisitions/:id/submit` | Submit for review (DRAFT → PENDING_REVIEW) | Bearer |
| PATCH | `/procurement/requisitions/:id/approve` | Approve request (PENDING_REVIEW → APPROVED; auto-creates purchase order) | Bearer |
| PATCH | `/procurement/requisitions/:id/reject` | Reject request (PENDING_REVIEW → REJECTED) | Bearer |

### Purchase Orders — `/procurement/orders`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/procurement/orders` | List purchase orders (query: status, supplierId, page, limit) | Bearer |
| GET | `/procurement/orders/:id` | Get purchase order by ID | Bearer |
| PATCH | `/procurement/orders/:id/receive` | Mark as received (PENDING → RECEIVED; triggers inventory ENTRY) | Bearer |
| PATCH | `/procurement/orders/:id/cancel` | Cancel purchase order (PENDING → CANCELLED) | Bearer |

### Supplier Invoices — `/procurement/invoices`

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/procurement/invoices` | Create supplier invoice for a purchase order | Bearer |
| GET | `/procurement/invoices` | List supplier invoices (query: status, supplierId, orderId, page, limit) | Bearer |
| GET | `/procurement/invoices/:id` | Get supplier invoice by ID | Bearer |
| PATCH | `/procurement/invoices/:id/pay` | Mark supplier invoice as paid | Bearer |
| PATCH | `/procurement/invoices/:id/overdue` | Mark supplier invoice as overdue | Bearer |
