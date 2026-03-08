import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateCustomerProspects1748000009000 implements MigrationInterface {
  name = 'CreateCustomerProspects1748000009000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."customer_prospects_status_enum" AS ENUM('NEW', 'CONTACTED', 'QUALIFIED', 'DISQUALIFIED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."customer_prospects_source_enum" AS ENUM('WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'COLD_OUTREACH', 'EVENT', 'OTHER')`,
    );

    await queryRunner.query(`
      CREATE TABLE "customer_prospects" (
        "id"        uuid      NOT NULL,
        "tenantId"  uuid      NOT NULL,
        "name"      varchar   NOT NULL,
        "email"     varchar   NULL DEFAULT NULL,
        "phone"     varchar   NULL DEFAULT NULL,
        "company"   varchar   NULL DEFAULT NULL,
        "source"    "public"."customer_prospects_source_enum" NULL DEFAULT NULL,
        "status"    "public"."customer_prospects_status_enum" NOT NULL DEFAULT 'NEW',
        "notes"     text      NULL DEFAULT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_customer_prospects"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_customer_prospects_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_prospects_tenant"                 ON "customer_prospects" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_customer_prospects_tenant_status" ON "customer_prospects" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_customer_prospects_tenant_status"`);
    await queryRunner.query(`DROP INDEX "IDX_prospects_tenant"`);
    await queryRunner.query(`DROP TABLE "customer_prospects"`);
    await queryRunner.query(`DROP TYPE "public"."customer_prospects_source_enum"`);
    await queryRunner.query(`DROP TYPE "public"."customer_prospects_status_enum"`);
  }
}
