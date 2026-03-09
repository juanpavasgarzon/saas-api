import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreatePurchaseRequests1748000018000 implements MigrationInterface {
  name = 'CreatePurchaseRequests1748000018000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."purchase_request_status_enum" AS ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "purchase_requests" (
        "id"         uuid          NOT NULL,
        "tenantId"   uuid          NOT NULL,
        "title"      varchar       NOT NULL,
        "vendorId"   uuid          NULL DEFAULT NULL,
        "prospectId" uuid          NULL DEFAULT NULL,
        "status"     "public"."purchase_request_status_enum" NOT NULL DEFAULT 'DRAFT',
        "notes"      text          NULL DEFAULT NULL,
        "subtotal"   numeric(12,2) NOT NULL DEFAULT 0,
        "total"      numeric(12,2) NOT NULL DEFAULT 0,
        "createdAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_purchase_requests"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_purchase_requests_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_purchase_requests_tenant"        ON "purchase_requests" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_purchase_requests_tenant_status" ON "purchase_requests" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_purchase_requests_tenant_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_purchase_requests_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_requests"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."purchase_request_status_enum"`);
  }
}
