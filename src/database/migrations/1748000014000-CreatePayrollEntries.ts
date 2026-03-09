import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreatePayrollEntries1748000014000 implements MigrationInterface {
  name = 'CreatePayrollEntries1748000014000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."payroll_entries_status_enum" AS ENUM('PENDING', 'PAID')`,
    );

    // Unique per employee per period prevents duplicate payroll entries.
    await queryRunner.query(`
      CREATE TABLE "payroll_entries" (
        "id"         uuid          NOT NULL,
        "tenantId"   uuid          NOT NULL,
        "employeeId" uuid          NOT NULL,
        "period"     varchar(7)    NOT NULL,
        "baseSalary" numeric(12,2) NOT NULL,
        "bonuses"    numeric(12,2) NOT NULL DEFAULT 0,
        "deductions" numeric(12,2) NOT NULL DEFAULT 0,
        "netPay"     numeric(12,2) NOT NULL,
        "daysWorked" integer       NOT NULL DEFAULT 0,
        "status"     "public"."payroll_entries_status_enum" NOT NULL DEFAULT 'PENDING',
        "paidAt"     TIMESTAMP     NULL DEFAULT NULL,
        "createdAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"  TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_payroll_period"   UNIQUE ("tenantId", "employeeId", "period"),
        CONSTRAINT "PK_payroll_entries"  PRIMARY KEY ("id"),
        CONSTRAINT "FK_payroll_tenant"   FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id")  ON DELETE CASCADE,
        CONSTRAINT "FK_payroll_employee" FOREIGN KEY ("employeeId")
          REFERENCES "employees"("id")  ON DELETE RESTRICT
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_payroll_tenant"        ON "payroll_entries" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_payroll_employee"      ON "payroll_entries" ("employeeId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_payroll_tenant_status" ON "payroll_entries" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_payroll_tenant_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_payroll_employee"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_payroll_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "payroll_entries"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."payroll_entries_status_enum"`);
  }
}
