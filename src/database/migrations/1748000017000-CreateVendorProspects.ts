import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateVendorProspects1748000017000 implements MigrationInterface {
  name = 'CreateVendorProspects1748000017000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."vendor_prospect_status_enum" AS ENUM('NEW', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "vendor_prospects" (
        "id"        uuid      NOT NULL,
        "tenantId"  uuid      NOT NULL,
        "name"      varchar   NOT NULL,
        "email"     varchar   NULL DEFAULT NULL,
        "phone"     varchar   NULL DEFAULT NULL,
        "company"              varchar   NULL DEFAULT NULL,
        "identificationNumber" varchar   NULL DEFAULT NULL,
        "address"              varchar   NULL DEFAULT NULL,
        "contactPerson"        varchar   NULL DEFAULT NULL,
        "notes"     text      NULL DEFAULT NULL,
        "status"    "public"."vendor_prospect_status_enum" NOT NULL DEFAULT 'NEW',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_vendor_prospects"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_vendor_prospects_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_vendor_prospects_tenant" ON "vendor_prospects" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_vendor_prospects_tenant_status" ON "vendor_prospects" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vendor_prospects_tenant_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_vendor_prospects_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "vendor_prospects"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."vendor_prospect_status_enum"`);
  }
}
