import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSupplierProspects1748000017000 implements MigrationInterface {
  name = 'CreateSupplierProspects1748000017000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."supplier_prospect_status_enum" AS ENUM('NEW', 'QUALIFIED', 'DISQUALIFIED', 'CONVERTED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "supplier_prospects" (
        "id"                   uuid      NOT NULL,
        "tenantId"             uuid      NOT NULL,
        "name"                 varchar   NOT NULL,
        "email"                varchar   NULL DEFAULT NULL,
        "phone"                varchar   NULL DEFAULT NULL,
        "company"              varchar   NULL DEFAULT NULL,
        "identificationNumber" varchar   NULL DEFAULT NULL,
        "address"              varchar   NULL DEFAULT NULL,
        "contactPerson"        varchar   NULL DEFAULT NULL,
        "notes"                text      NULL DEFAULT NULL,
        "status"    "public"."supplier_prospect_status_enum" NOT NULL DEFAULT 'NEW',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_supplier_prospects"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_supplier_prospects_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_supplier_prospects_tenant"        ON "supplier_prospects" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_supplier_prospects_tenant_status" ON "supplier_prospects" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "supplier_prospects"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."supplier_prospect_status_enum"`);
  }
}
