import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSupplierInvoices1748000029000 implements MigrationInterface {
  name = 'CreateSupplierInvoices1748000029000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."supplier_invoice_status_enum" AS ENUM('PENDING', 'PAID', 'OVERDUE')`,
    );

    await queryRunner.query(`
      CREATE TABLE "supplier_invoices" (
        "id"            uuid          NOT NULL DEFAULT gen_random_uuid(),
        "tenantId"      uuid          NOT NULL,
        "number"        integer       NOT NULL,
        "invoiceNumber" varchar       NOT NULL,
        "supplierId"    uuid          NOT NULL,
        "orderId"       uuid          NOT NULL,
        "amount"        numeric(12,2) NOT NULL,
        "dueDate"       date          NULL,
        "status"        "public"."supplier_invoice_status_enum" NOT NULL DEFAULT 'PENDING',
        "notes"         text          NULL,
        "paidAt"        TIMESTAMP     NULL,
        "createdAt"     TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_supplier_invoices"         PRIMARY KEY ("id"),
        CONSTRAINT "FK_supplier_invoices_tenant"   FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_supplier_invoices_supplier" FOREIGN KEY ("supplierId")
          REFERENCES "suppliers"("id"),
        CONSTRAINT "FK_supplier_invoices_po"       FOREIGN KEY ("orderId")
          REFERENCES "orders"("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_supplier_invoices_tenant"        ON "supplier_invoices" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_supplier_invoices_tenant_status" ON "supplier_invoices" ("tenantId", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_supplier_invoices_supplier"      ON "supplier_invoices" ("supplierId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_supplier_invoices_po"            ON "supplier_invoices" ("orderId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "supplier_invoices"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."supplier_invoice_status_enum"`);
  }
}
