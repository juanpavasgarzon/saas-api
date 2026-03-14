import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateDealItems1748000011000 implements MigrationInterface {
  name = 'CreateDealItems1748000011000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "deal_items" (
        "id"          uuid          NOT NULL,
        "dealId"      uuid          NOT NULL,
        "itemType"    "public"."line_item_type_enum" NOT NULL,
        "itemId"      uuid          NOT NULL,
        "description" varchar       NOT NULL,
        "quantity"    numeric(12,2) NOT NULL,
        "unit"        "public"."unit_of_measure_enum" NOT NULL DEFAULT 'UNIT',
        "unitPrice"   numeric(12,2) NOT NULL,
        "lineTotal"   numeric(12,2) NOT NULL,
        CONSTRAINT "PK_deal_items"      PRIMARY KEY ("id"),
        CONSTRAINT "FK_deal_items_sale" FOREIGN KEY ("dealId")
          REFERENCES "deals"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_deal_items_sale" ON "deal_items" ("dealId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_deal_items_item" ON "deal_items" ("itemType", "itemId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "deal_items"`);
  }
}
