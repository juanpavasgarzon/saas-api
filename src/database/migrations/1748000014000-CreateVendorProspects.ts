import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateVendorProspects1748000014000 implements MigrationInterface {
  name = 'CreateVendorProspects1748000014000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "vendor_prospects" (
        "id"        uuid      NOT NULL,
        "tenantId"  uuid      NOT NULL,
        "name"      varchar   NOT NULL,
        "email"     varchar   NULL DEFAULT NULL,
        "phone"     varchar   NULL DEFAULT NULL,
        "company"   varchar   NULL DEFAULT NULL,
        "notes"     text      NULL DEFAULT NULL,
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
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_vendor_prospects_tenant"`);
    await queryRunner.query(`DROP TABLE "vendor_prospects"`);
  }
}
