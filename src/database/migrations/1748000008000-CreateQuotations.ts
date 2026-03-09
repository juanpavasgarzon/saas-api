import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateQuotations1748000008000 implements MigrationInterface {
  name = 'CreateQuotations1748000008000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."quotations_status_enum" AS ENUM('DRAFT', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."unit_of_measure_enum" AS ENUM('UNIT', 'HOUR', 'DAY', 'METER', 'SQUARE_METER', 'KILOGRAM', 'GRAM', 'LITER', 'BOX', 'SET', 'OTHER')`,
    );

    await queryRunner.query(`
      CREATE TABLE "quotations" (
        "id"         uuid          NOT NULL,
        "tenantId"   uuid          NOT NULL,
        "number"     integer       NOT NULL,
        "title"      varchar       NOT NULL,
        "customerId" uuid          NULL DEFAULT NULL,
        "prospectId" uuid          NULL DEFAULT NULL,
        "status"     "public"."quotations_status_enum" NOT NULL DEFAULT 'DRAFT',
        "notes"      text          NULL DEFAULT NULL,
        "validUntil" TIMESTAMP     NULL DEFAULT NULL,
        "subtotal"   numeric(12,2) NOT NULL DEFAULT 0,
        "total"      numeric(12,2) NOT NULL DEFAULT 0,
        "createdAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_quotations"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_quotations_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_quotations_tenant"        ON "quotations" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_quotations_tenant_status" ON "quotations" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_quotations_tenant_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_quotations_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "quotations"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."unit_of_measure_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."quotations_status_enum"`);
  }
}
