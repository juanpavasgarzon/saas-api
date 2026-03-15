import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateProjects1748000006000 implements MigrationInterface {
  name = 'CreateProjects1748000006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."workspaces_status_enum" AS ENUM('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "workspaces" (
        "id"          uuid          NOT NULL,
        "tenantId"    uuid          NOT NULL,
        "name"        varchar       NOT NULL,
        "description" text          NOT NULL,
        "customerId"  uuid          NOT NULL,
        "status"      "public"."workspaces_status_enum" NOT NULL DEFAULT 'PLANNING',
        "budget"      numeric(12,2) NULL DEFAULT NULL,
        "startDate"   date          NULL DEFAULT NULL,
        "endDate"     date          NULL DEFAULT NULL,
        "createdAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_workspaces"          PRIMARY KEY ("id"),
        CONSTRAINT "FK_workspaces_tenant"   FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id")  ON DELETE CASCADE,
        CONSTRAINT "FK_workspaces_customer" FOREIGN KEY ("customerId")
          REFERENCES "customers"("id")  ON DELETE RESTRICT
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_workspaces_tenant"          ON "workspaces" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_workspaces_tenant_status"   ON "workspaces" ("tenantId", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_workspaces_tenant_customer" ON "workspaces" ("tenantId", "customerId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "workspaces"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."workspaces_status_enum"`);
  }
}
