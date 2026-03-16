import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateProducts1748000024000 implements MigrationInterface {
  name = 'CreateProducts1748000024000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "products" (
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
        CONSTRAINT "PK_products" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_products_tenant_sku" ON "products" ("tenantId", "sku")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_products_tenant"          ON "products" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_products_tenant_isActive" ON "products" ("tenantId", "isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "products"`);
  }
}
