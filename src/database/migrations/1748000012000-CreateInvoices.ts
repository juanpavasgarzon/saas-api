import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInvoices1748000012000 implements MigrationInterface {
  name = 'CreateInvoices1748000012000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."invoice_status_enum" AS ENUM('DRAFT', 'SENT', 'PAID', 'CANCELLED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "invoices" (
        "id"         uuid          NOT NULL,
        "tenantId"   uuid          NOT NULL,
        "number"     integer       NOT NULL,
        "saleId"     uuid          NOT NULL,
        "customerId" uuid          NOT NULL,
        "status"     "public"."invoice_status_enum" NOT NULL DEFAULT 'DRAFT',
        "notes"      text          NULL DEFAULT NULL,
        "subtotal"   numeric(12,2) NOT NULL DEFAULT 0,
        "total"      numeric(12,2) NOT NULL DEFAULT 0,
        "sentAt"     TIMESTAMP     NULL DEFAULT NULL,
        "paidAt"     TIMESTAMP     NULL DEFAULT NULL,
        "createdAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_invoices"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_invoices_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_invoices_sale"   FOREIGN KEY ("saleId")
          REFERENCES "sales"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_invoices_tenant"        ON "invoices" ("tenantId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_invoices_tenant_status" ON "invoices" ("tenantId", "status")`,
    );

    await queryRunner.query(`
      CREATE TABLE "invoice_items" (
        "id"          uuid          NOT NULL,
        "invoiceId"   uuid          NOT NULL,
        "description" varchar       NOT NULL,
        "quantity"    numeric(12,2) NOT NULL,
        "unit"        "public"."unit_of_measure_enum" NOT NULL DEFAULT 'UNIT',
        "unitPrice"   numeric(12,2) NOT NULL,
        "lineTotal"   numeric(12,2) NOT NULL,
        CONSTRAINT "PK_invoice_items"          PRIMARY KEY ("id"),
        CONSTRAINT "FK_invoice_items_invoice"  FOREIGN KEY ("invoiceId")
          REFERENCES "invoices"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_invoice_items_invoice" ON "invoice_items" ("invoiceId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_invoice_items_invoice"`);
    await queryRunner.query(`DROP TABLE "invoice_items"`);
    await queryRunner.query(`DROP INDEX "IDX_invoices_tenant_status"`);
    await queryRunner.query(`DROP INDEX "IDX_invoices_tenant"`);
    await queryRunner.query(`DROP TABLE "invoices"`);
    await queryRunner.query(`DROP TYPE "public"."invoice_status_enum"`);
  }
}
