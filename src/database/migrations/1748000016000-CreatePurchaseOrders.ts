import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreatePurchaseOrders1748000016000 implements MigrationInterface {
  name = 'CreatePurchaseOrders1748000016000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."purchase_order_status_enum" AS ENUM('PENDING', 'RECEIVED', 'CANCELLED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "purchase_orders" (
        "id"                uuid          NOT NULL,
        "tenantId"          uuid          NOT NULL,
        "purchaseRequestId" uuid          NOT NULL,
        "vendorId"          uuid          NOT NULL,
        "status"            "public"."purchase_order_status_enum" NOT NULL DEFAULT 'PENDING',
        "subtotal"          numeric(12,2) NOT NULL DEFAULT 0,
        "total"             numeric(12,2) NOT NULL DEFAULT 0,
        "createdAt"         TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"         TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_purchase_orders"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_purchase_orders_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_purchase_orders_tenant"        ON "purchase_orders" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_purchase_orders_tenant_status" ON "purchase_orders" ("tenantId", "status")`,
    );

    await queryRunner.query(`
      CREATE TABLE "purchase_order_items" (
        "id"              uuid          NOT NULL,
        "purchaseOrderId" uuid          NOT NULL,
        "description"     varchar       NOT NULL,
        "quantity"        numeric(10,2) NOT NULL,
        "unitPrice"       numeric(12,2) NOT NULL,
        "lineTotal"       numeric(12,2) NOT NULL,
        CONSTRAINT "PK_purchase_order_items"               PRIMARY KEY ("id"),
        CONSTRAINT "FK_purchase_order_items_purchase_order" FOREIGN KEY ("purchaseOrderId")
          REFERENCES "purchase_orders"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_purchase_order_items_order" ON "purchase_order_items" ("purchaseOrderId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_purchase_order_items_order"`);
    await queryRunner.query(`DROP TABLE "purchase_order_items"`);
    await queryRunner.query(`DROP INDEX "IDX_purchase_orders_tenant_status"`);
    await queryRunner.query(`DROP INDEX "IDX_purchase_orders_tenant"`);
    await queryRunner.query(`DROP TABLE "purchase_orders"`);
    await queryRunner.query(`DROP TYPE "public"."purchase_order_status_enum"`);
  }
}
