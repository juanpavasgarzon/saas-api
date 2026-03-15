import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateDeals1748000010000 implements MigrationInterface {
  name = 'CreateDeals1748000010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."deal_status_enum" AS ENUM('PENDING', 'APPROVED', 'INVOICED', 'CANCELLED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "deals" (
        "id"          uuid          NOT NULL,
        "tenantId"    uuid          NOT NULL,
        "number"      integer       NOT NULL,
        "customerId"  uuid          NOT NULL,
        "quotationId" uuid          NULL DEFAULT NULL,
        "status"      "public"."deal_status_enum" NOT NULL DEFAULT 'PENDING',
        "notes"       text          NULL DEFAULT NULL,
        "subtotal"    numeric(12,2) NOT NULL DEFAULT 0,
        "total"       numeric(12,2) NOT NULL DEFAULT 0,
        "createdAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_deals"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_deals_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_deals_tenant"        ON "deals" ("tenantId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_deals_tenant_status" ON "deals" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "deals"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."deal_status_enum"`);
  }
}
