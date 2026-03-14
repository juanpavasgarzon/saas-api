import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateRequisitions1748000018000 implements MigrationInterface {
  name = 'CreateRequisitions1748000018000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."requisition_status_enum" AS ENUM('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "requisitions" (
        "id"         uuid          NOT NULL,
        "tenantId"   uuid          NOT NULL,
        "title"      varchar       NOT NULL,
        "supplierId" uuid          NULL DEFAULT NULL,
        "prospectId" uuid          NULL DEFAULT NULL,
        "status"     "public"."requisition_status_enum" NOT NULL DEFAULT 'DRAFT',
        "notes"      text          NULL DEFAULT NULL,
        "subtotal"   numeric(12,2) NOT NULL DEFAULT 0,
        "total"      numeric(12,2) NOT NULL DEFAULT 0,
        "createdAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_requisitions"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_requisitions_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_requisitions_tenant"        ON "requisitions" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_requisitions_tenant_status" ON "requisitions" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "requisitions"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."requisition_status_enum"`);
  }
}
