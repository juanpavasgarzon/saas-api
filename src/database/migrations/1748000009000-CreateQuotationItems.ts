import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateQuotationItems1748000009000 implements MigrationInterface {
  name = 'CreateQuotationItems1748000009000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "quotation_items" (
        "id"          uuid          NOT NULL,
        "quotationId" uuid          NOT NULL,
        "description" varchar       NOT NULL,
        "quantity"    numeric(12,2) NOT NULL,
        "unit"        "public"."unit_of_measure_enum" NOT NULL DEFAULT 'UNIT',
        "unitPrice"   numeric(12,2) NOT NULL,
        "lineTotal"   numeric(12,2) NOT NULL,
        CONSTRAINT "PK_quotation_items"          PRIMARY KEY ("id"),
        CONSTRAINT "FK_quotation_items_quotation" FOREIGN KEY ("quotationId")
          REFERENCES "quotations"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_quotation_items_quotation" ON "quotation_items" ("quotationId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_quotation_items_quotation"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "quotation_items"`);
  }
}
