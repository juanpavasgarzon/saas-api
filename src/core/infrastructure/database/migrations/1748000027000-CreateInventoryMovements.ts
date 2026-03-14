import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInventoryMovements1748000027000 implements MigrationInterface {
  name = 'CreateInventoryMovements1748000027000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."inventory_movement_type_enum" AS ENUM('ENTRY', 'EXIT', 'TRANSFER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inventory_movement_source_enum" AS ENUM('MANUAL', 'SALE', 'PURCHASE')`,
    );

    await queryRunner.query(`
      CREATE TABLE "inventory_movements" (
        "id"            uuid          NOT NULL,
        "tenantId"      varchar       NOT NULL,
        "productId"     uuid          NOT NULL,
        "warehouseId"   uuid          NULL DEFAULT NULL,
        "toWarehouseId" uuid          NULL DEFAULT NULL,
        "type"          "public"."inventory_movement_type_enum"   NOT NULL,
        "source"        "public"."inventory_movement_source_enum" NOT NULL DEFAULT 'MANUAL',
        "quantity"      numeric(12,4) NOT NULL,
        "referenceId"   varchar       NULL DEFAULT NULL,
        "notes"         varchar       NULL DEFAULT NULL,
        "createdAt"     TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_movements" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_movements_tenant"         ON "inventory_movements" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_movements_tenant_product" ON "inventory_movements" ("tenantId", "productId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_movements"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."inventory_movement_source_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."inventory_movement_type_enum"`);
  }
}
