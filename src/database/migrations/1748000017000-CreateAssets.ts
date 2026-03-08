import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateAssets1748000017000 implements MigrationInterface {
  name = 'CreateAssets1748000017000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."asset_status_enum" AS ENUM('ACTIVE', 'ASSIGNED', 'INACTIVE', 'RETIRED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."asset_category_enum" AS ENUM('EQUIPMENT', 'FURNITURE', 'VEHICLE', 'SOFTWARE', 'OTHER')`,
    );

    await queryRunner.query(`
      CREATE TABLE "assets" (
        "id"            uuid          NOT NULL,
        "tenantId"      uuid          NOT NULL,
        "number"        integer       NOT NULL,
        "name"          varchar       NOT NULL,
        "category"      "public"."asset_category_enum" NOT NULL,
        "serialNumber"  varchar       NULL DEFAULT NULL,
        "description"   text          NULL DEFAULT NULL,
        "status"        "public"."asset_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "purchaseDate"  date          NULL DEFAULT NULL,
        "purchaseValue" numeric(12,2) NULL DEFAULT NULL,
        "createdAt"     TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_assets"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_assets_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_assets_tenant"        ON "assets" ("tenantId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_assets_tenant_status" ON "assets" ("tenantId", "status")`,
    );

    await queryRunner.query(`
      CREATE TABLE "asset_assignments" (
        "id"         uuid      NOT NULL,
        "assetId"    uuid      NOT NULL,
        "projectId"  uuid      NULL DEFAULT NULL,
        "employeeId" uuid      NULL DEFAULT NULL,
        "assignedAt" TIMESTAMP NOT NULL,
        "returnedAt" TIMESTAMP NULL DEFAULT NULL,
        CONSTRAINT "PK_asset_assignments"       PRIMARY KEY ("id"),
        CONSTRAINT "FK_asset_assignments_asset" FOREIGN KEY ("assetId")
          REFERENCES "assets"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_asset_assignments_asset" ON "asset_assignments" ("assetId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_asset_assignments_asset"`);
    await queryRunner.query(`DROP TABLE "asset_assignments"`);
    await queryRunner.query(`DROP INDEX "IDX_assets_tenant_status"`);
    await queryRunner.query(`DROP INDEX "IDX_assets_tenant"`);
    await queryRunner.query(`DROP TABLE "assets"`);
    await queryRunner.query(`DROP TYPE "public"."asset_category_enum"`);
    await queryRunner.query(`DROP TYPE "public"."asset_status_enum"`);
  }
}
