import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateStock1748000026000 implements MigrationInterface {
  name = 'CreateStock1748000026000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "stock" (
        "id"               uuid          NOT NULL,
        "tenantId"         varchar       NOT NULL,
        "productId"        uuid          NOT NULL,
        "warehouseId"      uuid          NOT NULL,
        "quantity"         numeric(12,4) NOT NULL DEFAULT 0,
        "reservedQuantity" numeric(12,4) NOT NULL DEFAULT 0,
        "createdAt"        TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"        TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_stock"           PRIMARY KEY ("id"),
        CONSTRAINT "FK_stock_product"   FOREIGN KEY ("productId")
          REFERENCES "products"("id")   ON DELETE CASCADE,
        CONSTRAINT "FK_stock_warehouse" FOREIGN KEY ("warehouseId")
          REFERENCES "warehouses"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_stock_tenant_product_warehouse" ON "stock" ("tenantId", "productId", "warehouseId")`,
    );
    await queryRunner.query(`CREATE INDEX "IDX_stock_tenant" ON "stock" ("tenantId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "stock"`);
  }
}
