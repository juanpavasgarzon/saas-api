import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateQuotations1748000010000 implements MigrationInterface {
  name = 'CreateQuotations1748000010000';

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

    await queryRunner.query(`
      CREATE TABLE "quotation_items" (
        "id"          uuid          NOT NULL,
        "quotationId" uuid          NOT NULL,
        "description" varchar       NOT NULL,
        "quantity"    numeric(12,2) NOT NULL,
        "unit"        "public"."unit_of_measure_enum" NOT NULL DEFAULT 'UNIT',
        "unitPrice"   numeric(12,2) NOT NULL,
        "lineTotal"   numeric(12,2) NOT NULL,
        CONSTRAINT "PK_quotation_items"          PRIMARY KEY ("id"),
        CONSTRAINT "FK_quotation_items_quotation" FOREIGN KEY ("quotationId")
          REFERENCES "quotations"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_quotation_items_quotation" ON "quotation_items" ("quotationId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_quotation_items_quotation"`);
    await queryRunner.query(`DROP TABLE "quotation_items"`);
    await queryRunner.query(`DROP INDEX "IDX_quotations_tenant_status"`);
    await queryRunner.query(`DROP INDEX "IDX_quotations_tenant"`);
    await queryRunner.query(`DROP TABLE "quotations"`);
    await queryRunner.query(`DROP TYPE "public"."unit_of_measure_enum"`);
    await queryRunner.query(`DROP TYPE "public"."quotations_status_enum"`);
  }
}
