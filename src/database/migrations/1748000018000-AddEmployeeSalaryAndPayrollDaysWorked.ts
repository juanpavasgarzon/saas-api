import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddEmployeeSalaryAndPayrollDaysWorked1748000018000 implements MigrationInterface {
  name = 'AddEmployeeSalaryAndPayrollDaysWorked1748000018000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "employees" ADD COLUMN IF NOT EXISTS "basicSalary" decimal(12,2) NOT NULL DEFAULT 0`,
    );
    await queryRunner.query(
      `ALTER TABLE "payroll_entries" ADD COLUMN IF NOT EXISTS "daysWorked" integer NOT NULL DEFAULT 0`,
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "payroll_entries" DROP COLUMN IF EXISTS "daysWorked"`);
    await queryRunner.query(`ALTER TABLE "employees" DROP COLUMN IF EXISTS "basicSalary"`);
  }
}
