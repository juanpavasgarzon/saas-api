import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInventory1748000019000 implements MigrationInterface {
  name = 'CreateInventory1748000019000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE IF NOT EXISTS "public"."inventory_movement_type_enum" AS ENUM('ENTRY', 'EXIT', 'TRANSFER')`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_products" (
        "id"          uuid        NOT NULL,
        "tenantId"    varchar     NOT NULL,
        "name"        varchar     NOT NULL,
        "sku"         varchar     NOT NULL,
        "description" varchar     NULL DEFAULT NULL,
        "unit"        varchar     NOT NULL,
        "category"    varchar     NULL DEFAULT NULL,
        "isActive"    boolean     NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP   NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_products" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_inventory_products_tenant_sku" ON "inventory_products" ("tenantId", "sku")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_inventory_products_tenant" ON "inventory_products" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_inventory_products_tenant_isActive" ON "inventory_products" ("tenantId", "isActive")`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_warehouses" (
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
      `CREATE INDEX IF NOT EXISTS "IDX_inventory_warehouses_tenant" ON "inventory_warehouses" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_inventory_warehouses_tenant_isActive" ON "inventory_warehouses" ("tenantId", "isActive")`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_stock" (
        "id"               uuid           NOT NULL,
        "tenantId"         varchar        NOT NULL,
        "productId"        uuid           NOT NULL,
        "warehouseId"      uuid           NOT NULL,
        "quantity"         numeric(12,4)  NOT NULL DEFAULT 0,
        "reservedQuantity" numeric(12,4)  NOT NULL DEFAULT 0,
        "createdAt"        TIMESTAMP      NOT NULL DEFAULT now(),
        "updatedAt"        TIMESTAMP      NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_stock" PRIMARY KEY ("id"),
        CONSTRAINT "FK_inventory_stock_product"   FOREIGN KEY ("productId")   REFERENCES "inventory_products"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_inventory_stock_warehouse" FOREIGN KEY ("warehouseId") REFERENCES "inventory_warehouses"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "UQ_inventory_stock_tenant_product_warehouse" ON "inventory_stock" ("tenantId", "productId", "warehouseId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_inventory_stock_tenant" ON "inventory_stock" ("tenantId")`,
    );

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "inventory_movements" (
        "id"          uuid          NOT NULL,
        "tenantId"    varchar       NOT NULL,
        "productId"   uuid          NOT NULL,
        "warehouseId" uuid          NULL DEFAULT NULL,
        "type"        "public"."inventory_movement_type_enum" NOT NULL,
        "quantity"    numeric(12,4) NOT NULL,
        "referenceId" varchar       NULL DEFAULT NULL,
        "notes"       varchar       NULL DEFAULT NULL,
        "createdAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inventory_movements" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_inventory_movements_tenant" ON "inventory_movements" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "IDX_inventory_movements_tenant_product" ON "inventory_movements" ("tenantId", "productId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_movements_tenant_product"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_movements_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_movements"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_stock_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_inventory_stock_tenant_product_warehouse"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_stock"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_warehouses_tenant_isActive"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_warehouses_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_warehouses"`);

    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_products_tenant_isActive"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_inventory_products_tenant"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "UQ_inventory_products_tenant_sku"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "inventory_products"`);

    await queryRunner.query(`DROP TYPE IF EXISTS "public"."inventory_movement_type_enum"`);
  }
}
