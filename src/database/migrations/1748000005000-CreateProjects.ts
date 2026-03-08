import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateProjects1748000005000 implements MigrationInterface {
  name = 'CreateProjects1748000005000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."projects_status_enum" AS ENUM('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "projects" (
        "id"          uuid          NOT NULL,
        "tenantId"    uuid          NOT NULL,
        "name"        varchar       NOT NULL,
        "description" text          NOT NULL,
        "customerId"  uuid          NOT NULL,
        "status"      "public"."projects_status_enum" NOT NULL DEFAULT 'PLANNING',
        "budget"      numeric(12,2) NULL DEFAULT NULL,
        "startDate"   date          NULL DEFAULT NULL,
        "endDate"     date          NULL DEFAULT NULL,
        "createdAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_projects"          PRIMARY KEY ("id"),
        CONSTRAINT "FK_projects_tenant"   FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id")  ON DELETE CASCADE,
        CONSTRAINT "FK_projects_customer" FOREIGN KEY ("customerId")
          REFERENCES "customers"("id")  ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_projects_tenant"          ON "projects" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_projects_tenant_status"   ON "projects" ("tenantId", "status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_projects_tenant_customer" ON "projects" ("tenantId", "customerId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_projects_tenant_customer"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_tenant_status"`);
    await queryRunner.query(`DROP INDEX "IDX_projects_tenant"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
  }
}
