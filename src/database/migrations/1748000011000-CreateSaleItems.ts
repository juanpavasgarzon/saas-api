import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSaleItems1748000011000 implements MigrationInterface {
  name = 'CreateSaleItems1748000011000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "sale_items" (
        "id"          uuid          NOT NULL,
        "saleId"      uuid          NOT NULL,
        "description" varchar       NOT NULL,
        "quantity"    numeric(12,2) NOT NULL,
        "unit"        "public"."unit_of_measure_enum" NOT NULL DEFAULT 'UNIT',
        "unitPrice"   numeric(12,2) NOT NULL,
        "lineTotal"   numeric(12,2) NOT NULL,
        CONSTRAINT "PK_sale_items"      PRIMARY KEY ("id"),
        CONSTRAINT "FK_sale_items_sale" FOREIGN KEY ("saleId")
          REFERENCES "sales"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_sale_items_sale" ON "sale_items" ("saleId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sale_items_sale"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sale_items"`);
  }
}
