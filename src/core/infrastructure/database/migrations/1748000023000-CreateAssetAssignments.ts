import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateAssetAssignments1748000023000 implements MigrationInterface {
  name = 'CreateAssetAssignments1748000023000';

  public async up(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`DROP TABLE IF EXISTS "asset_assignments"`);
  }
}
