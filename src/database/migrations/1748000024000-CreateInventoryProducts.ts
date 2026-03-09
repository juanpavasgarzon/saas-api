import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInventoryProducts1748000024000 implements MigrationInterface {
  name = 'CreateInventoryProducts1748000024000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inventory_products" (
        "id"          uuid      NOT NULL,
        "tenantId"    varchar   NOT NULL,
        "name"        varchar   NOT NULL,
        "sku"         varchar   NOT NULL,
        "description" varchar   NULL DEFAULT NULL,
        "unit"        varchar   NOT NULL,
        "category"    varchar   NULL DEFAULT NULL,
        "isActive"    boolean   NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_products" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_inventory_products_tenant_sku" ON "inventory_products" ("tenantId", "sku")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_products_tenant" ON "inventory_products" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_products_tenant_isActive" ON "inventory_products" ("tenantId", "isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_products_tenant_isActive"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_products_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_inventory_products_tenant_sku"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_products"`);
  }
}
