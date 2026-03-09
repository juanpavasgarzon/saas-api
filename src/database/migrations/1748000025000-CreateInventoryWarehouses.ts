import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInventoryWarehouses1748000025000 implements MigrationInterface {
  name = 'CreateInventoryWarehouses1748000025000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inventory_warehouses" (
        "id"        uuid      NOT NULL,
        "tenantId"  varchar   NOT NULL,
        "name"      varchar   NOT NULL,
        "location"  varchar   NULL DEFAULT NULL,
        "isActive"  boolean   NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_warehouses" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_warehouses_tenant" ON "inventory_warehouses" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_warehouses_tenant_isActive" ON "inventory_warehouses" ("tenantId", "isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_warehouses_tenant_isActive"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_warehouses_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_warehouses"`);
  }
}
