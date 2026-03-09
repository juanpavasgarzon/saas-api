import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreatePurchaseOrders1748000020000 implements MigrationInterface {
  name = 'CreatePurchaseOrders1748000020000';

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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_purchase_orders_tenant_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_purchase_orders_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_orders"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."purchase_order_status_enum"`);
  }
}
