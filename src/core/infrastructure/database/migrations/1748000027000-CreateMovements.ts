import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateMovements1748000027000 implements MigrationInterface {
  name = 'CreateMovements1748000027000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."movement_type_enum" AS ENUM('ENTRY', 'EXIT', 'TRANSFER')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."movement_source_enum" AS ENUM('MANUAL', 'SALE', 'PURCHASE')`,
    );

    await queryRunner.query(`
      CREATE TABLE "movements" (
        "id"            uuid          NOT NULL,
        "tenantId"      varchar       NOT NULL,
        "productId"     uuid          NOT NULL,
        "warehouseId"   uuid          NULL DEFAULT NULL,
        "toWarehouseId" uuid          NULL DEFAULT NULL,
        "type"          "public"."movement_type_enum"   NOT NULL,
        "source"        "public"."movement_source_enum" NOT NULL DEFAULT 'MANUAL',
        "quantity"      numeric(12,4) NOT NULL,
        "referenceId"   varchar       NULL DEFAULT NULL,
        "notes"         varchar       NULL DEFAULT NULL,
        "createdAt"     TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_movements" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_movements_tenant"         ON "movements" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_movements_tenant_product" ON "movements" ("tenantId", "productId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "movements"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movement_source_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."movement_type_enum"`);
  }
}
