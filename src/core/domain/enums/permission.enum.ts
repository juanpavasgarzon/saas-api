export enum Permission {
  OrganizationCompaniesRead = 'organization:companies:read',
  OrganizationCompaniesModify = 'organization:companies:modify',
  OrganizationCompaniesRemove = 'organization:companies:remove',

  IdentityAccountsCreate = 'identity:accounts:create',
  IdentityAccountsRead = 'identity:accounts:read',
  IdentityAccountsRemove = 'identity:accounts:remove',

  OrganizationEmployeesCreate = 'organization:employees:create',
  OrganizationEmployeesRead = 'organization:employees:read',
  OrganizationEmployeesModify = 'organization:employees:modify',
  OrganizationEmployeesRemove = 'organization:employees:remove',

  CrmCustomersCreate = 'crm:customers:create',
  CrmCustomersRead = 'crm:customers:read',
  CrmCustomersModify = 'crm:customers:modify',
  CrmCustomersRemove = 'crm:customers:remove',

  CrmProspectsCreate = 'crm:prospects:create',
  CrmProspectsRead = 'crm:prospects:read',
  CrmProspectsModify = 'crm:prospects:modify',
  CrmProspectsRemove = 'crm:prospects:remove',

  CrmQuotationsCreate = 'crm:quotations:create',
  CrmQuotationsRead = 'crm:quotations:read',
  CrmQuotationsModify = 'crm:quotations:modify',
  CrmQuotationsRemove = 'crm:quotations:remove',
  CrmQuotationsDownload = 'crm:quotations:download',

  ProjectsCreate = 'projects:create',
  ProjectsRead = 'projects:read',
  ProjectsModify = 'projects:modify',
  ProjectsRemove = 'projects:remove',

  ProjectMembersCreate = 'projects:members:create',
  ProjectMembersRead = 'projects:members:read',
  ProjectMembersRemove = 'projects:members:remove',

  FinancePayrollCreate = 'finance:payroll:create',
  FinancePayrollRead = 'finance:payroll:read',
  FinancePayrollModify = 'finance:payroll:modify',

  FinanceAccountingCreate = 'finance:accounting:create',
  FinanceAccountingRead = 'finance:accounting:read',

  SalesDealsCreate = 'sales:deals:create',
  SalesDealsRead = 'sales:deals:read',
  SalesDealsModify = 'sales:deals:modify',
  SalesDealsApprove = 'sales:deals:approve',
  SalesDealsDownload = 'sales:deals:download',

  SalesInvoicesRead = 'sales:invoices:read',
  SalesInvoicesModify = 'sales:invoices:modify',
  SalesInvoicesSend = 'sales:invoices:send',
  SalesInvoicesPay = 'sales:invoices:pay',
  SalesInvoicesDownload = 'sales:invoices:download',

  FinancePayrollDownload = 'finance:payroll:download',

  FinanceAccountingDownload = 'finance:accounting:download',

  ProcurementSuppliersCreate = 'procurement:suppliers:create',
  ProcurementSuppliersRead = 'procurement:suppliers:read',
  ProcurementSuppliersModify = 'procurement:suppliers:modify',

  ProcurementRequisitionsCreate = 'procurement:requisitions:create',
  ProcurementRequisitionsRead = 'procurement:requisitions:read',
  ProcurementRequisitionsApprove = 'procurement:requisitions:approve',
  ProcurementRequisitionsRemove = 'procurement:requisitions:remove',

  ProcurementOrdersRead = 'procurement:orders:read',
  ProcurementOrdersReceive = 'procurement:orders:receive',
  ProcurementOrdersCancel = 'procurement:orders:cancel',

  OrganizationAssetsCreate = 'organization:assets:create',
  OrganizationAssetsRead = 'organization:assets:read',
  OrganizationAssetsModify = 'organization:assets:modify',
  OrganizationAssetsRemove = 'organization:assets:remove',
  OrganizationAssetsAssign = 'organization:assets:assign',

  CatalogProductsCreate = 'catalog:products:create',
  CatalogProductsRead = 'catalog:products:read',
  CatalogProductsModify = 'catalog:products:modify',
  CatalogProductsRemove = 'catalog:products:remove',

  CatalogServicesCreate = 'catalog:services:create',
  CatalogServicesRead = 'catalog:services:read',
  CatalogServicesModify = 'catalog:services:modify',
  CatalogServicesRemove = 'catalog:services:remove',

  InventoryWarehousesCreate = 'inventory:warehouses:create',
  InventoryWarehousesRead = 'inventory:warehouses:read',
  InventoryWarehousesModify = 'inventory:warehouses:modify',
  InventoryWarehousesRemove = 'inventory:warehouses:remove',

  InventoryStockRead = 'inventory:stock:read',

  InventoryMovementsCreate = 'inventory:movements:create',
  InventoryMovementsRead = 'inventory:movements:read',

  ProcurementInvoicesCreate = 'procurement:invoices:create',
  ProcurementInvoicesRead = 'procurement:invoices:read',
  ProcurementInvoicesModify = 'procurement:invoices:modify',
  ProcurementInvoicesPay = 'procurement:invoices:pay',
}
