import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInvoiceItems1748000013000 implements MigrationInterface {
  name = 'CreateInvoiceItems1748000013000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "invoice_items" (
        "id"          uuid          NOT NULL,
        "invoiceId"   uuid          NOT NULL,
        "description" varchar       NOT NULL,
        "quantity"    numeric(12,2) NOT NULL,
        "unit"        "public"."unit_of_measure_enum" NOT NULL DEFAULT 'UNIT',
        "unitPrice"   numeric(12,2) NOT NULL,
        "lineTotal"   numeric(12,2) NOT NULL,
        CONSTRAINT "PK_invoice_items"         PRIMARY KEY ("id"),
        CONSTRAINT "FK_invoice_items_invoice" FOREIGN KEY ("invoiceId")
          REFERENCES "invoices"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_invoice_items_invoice" ON "invoice_items" ("invoiceId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_invoice_items_invoice"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "invoice_items"`);
  }
}
