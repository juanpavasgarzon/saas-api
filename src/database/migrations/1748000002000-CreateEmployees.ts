import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateEmployees1748000002000 implements MigrationInterface {
  name = 'CreateEmployees1748000002000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."employees_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE')`,
    );

    // email unique per tenant — two tenants may share the same employee email.
    await queryRunner.query(`
      CREATE TABLE "employees" (
        "id"         uuid      NOT NULL,
        "tenantId"   uuid      NOT NULL,
        "firstName"  varchar   NOT NULL,
        "lastName"   varchar   NOT NULL,
        "email"      varchar   NOT NULL,
        "position"   varchar   NOT NULL,
        "department" varchar   NOT NULL,
        "status"     "public"."employees_status_enum" NOT NULL DEFAULT 'ACTIVE',
        "hiredAt"    date      NOT NULL,
        "createdAt"  TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_employees_tenant_email" UNIQUE ("tenantId", "email"),
        CONSTRAINT "PK_employees"              PRIMARY KEY ("id"),
        CONSTRAINT "FK_employees_tenant"       FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_employees_tenant"            ON "employees" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_tenant_department" ON "employees" ("tenantId", "department")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_employees_tenant_status"     ON "employees" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_employees_tenant_status"`);
    await queryRunner.query(`DROP INDEX "IDX_employees_tenant_department"`);
    await queryRunner.query(`DROP INDEX "IDX_employees_tenant"`);
    await queryRunner.query(`DROP TABLE "employees"`);
    await queryRunner.query(`DROP TYPE "public"."employees_status_enum"`);
  }
}
