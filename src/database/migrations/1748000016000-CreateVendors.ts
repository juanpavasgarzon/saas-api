import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateVendors1748000016000 implements MigrationInterface {
  name = 'CreateVendors1748000016000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "vendors" (
        "id"            uuid      NOT NULL,
        "tenantId"      uuid      NOT NULL,
        "name"          varchar   NOT NULL,
        "email"         varchar   NOT NULL,
        "phone"         varchar   NOT NULL DEFAULT '',
        "address"       varchar   NOT NULL DEFAULT '',
        "contactPerson" varchar   NOT NULL DEFAULT '',
        "isActive"      boolean   NOT NULL DEFAULT true,
        "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_vendors"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_vendors_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_vendors_tenant" ON "vendors" ("tenantId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vendors_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vendors"`);
  }
}
