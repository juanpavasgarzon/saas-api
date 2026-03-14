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
        "dealId"     uuid          NOT NULL,
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
        CONSTRAINT "FK_invoices_sale"   FOREIGN KEY ("dealId")
          REFERENCES "deals"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_invoices_tenant"        ON "invoices" ("tenantId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_invoices_tenant_status" ON "invoices" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "invoices"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."invoice_status_enum"`);
  }
}
