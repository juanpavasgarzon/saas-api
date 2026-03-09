import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInventoryStock1748000026000 implements MigrationInterface {
  name = 'CreateInventoryStock1748000026000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "inventory_stock" (
        "id"               uuid          NOT NULL,
        "tenantId"         varchar       NOT NULL,
        "productId"        uuid          NOT NULL,
        "warehouseId"      uuid          NOT NULL,
        "quantity"         numeric(12,4) NOT NULL DEFAULT 0,
        "reservedQuantity" numeric(12,4) NOT NULL DEFAULT 0,
        "createdAt"        TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"        TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_stock"           PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_stock_product"   FOREIGN KEY ("productId")
          REFERENCES "inventory_products"("id")   ON DELETE CASCADE,
        CONSTRAINT "FK_inventory_stock_warehouse" FOREIGN KEY ("warehouseId")
          REFERENCES "inventory_warehouses"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_inventory_stock_tenant_product_warehouse" ON "inventory_stock" ("tenantId", "productId", "warehouseId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inventory_stock_tenant" ON "inventory_stock" ("tenantId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_stock_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_inventory_stock_tenant_product_warehouse"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_stock"`);
  }
}
