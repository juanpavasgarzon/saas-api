import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateOrders1748000020000 implements MigrationInterface {
  name = 'CreateOrders1748000020000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."order_status_enum" AS ENUM('PENDING', 'RECEIVED', 'CANCELLED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "orders" (
        "id"            uuid          NOT NULL,
        "tenantId"      uuid          NOT NULL,
        "requisitionId" uuid          NOT NULL,
        "supplierId"    uuid          NOT NULL,
        "status"        "public"."order_status_enum" NOT NULL DEFAULT 'PENDING',
        "subtotal"      numeric(12,2) NOT NULL DEFAULT 0,
        "total"         numeric(12,2) NOT NULL DEFAULT 0,
        "createdAt"     TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_orders_tenant"        ON "orders" ("tenantId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_orders_tenant_status" ON "orders" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "orders"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."order_status_enum"`);
  }
}
