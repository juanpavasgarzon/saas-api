import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateOrderItems1748000021000 implements MigrationInterface {
  name = 'CreateOrderItems1748000021000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "order_items" (
        "id"          uuid          NOT NULL,
        "orderId"     uuid          NOT NULL,
        "itemType"    "public"."line_item_type_enum" NOT NULL,
        "itemId"      uuid          NOT NULL,
        "description" varchar       NOT NULL,
        "quantity"    numeric(10,2) NOT NULL,
        "unitPrice"   numeric(12,2) NOT NULL,
        "lineTotal"   numeric(12,2) NOT NULL,
        CONSTRAINT "PK_order_items"         PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_order"   FOREIGN KEY ("orderId")
          REFERENCES "orders"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_order_items_item" ON "order_items" ("itemType", "itemId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "order_items"`);
  }
}
