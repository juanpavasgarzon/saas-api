import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreatePurchaseOrderItems1748000021000 implements MigrationInterface {
  name = 'CreatePurchaseOrderItems1748000021000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "purchase_order_items" (
        "id"              uuid          NOT NULL,
        "purchaseOrderId" uuid          NOT NULL,
        "description"     varchar       NOT NULL,
        "quantity"        numeric(10,2) NOT NULL,
        "unitPrice"       numeric(12,2) NOT NULL,
        "lineTotal"       numeric(12,2) NOT NULL,
        CONSTRAINT "PK_purchase_order_items"                PRIMARY KEY ("id"),
        CONSTRAINT "FK_purchase_order_items_purchase_order" FOREIGN KEY ("purchaseOrderId")
          REFERENCES "purchase_orders"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_purchase_order_items_order" ON "purchase_order_items" ("purchaseOrderId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_purchase_order_items_order"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_order_items"`);
  }
}
