import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateWarehouses1748000025000 implements MigrationInterface {
  name = 'CreateWarehouses1748000025000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "warehouses" (
        "id"        uuid      NOT NULL,
        "tenantId"  varchar   NOT NULL,
        "name"      varchar   NOT NULL,
        "location"  varchar   NULL DEFAULT NULL,
        "isActive"  boolean   NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_warehouses" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_warehouses_tenant" ON "warehouses" ("tenantId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_warehouses_tenant_isActive" ON "warehouses" ("tenantId", "isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "warehouses"`);
  }
}
