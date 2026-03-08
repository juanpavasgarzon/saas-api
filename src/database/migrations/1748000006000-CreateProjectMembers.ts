import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateProjectMembers1748000006000 implements MigrationInterface {
  name = 'CreateProjectMembers1748000006000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."project_members_role_enum" AS ENUM('LEAD', 'MEMBER')`,
    );

    await queryRunner.query(`
      CREATE TABLE "project_members" (
        "id"         uuid      NOT NULL,
        "projectId"  uuid      NOT NULL,
        "tenantId"   uuid      NOT NULL,
        "employeeId" uuid      NOT NULL,
        "role"       "public"."project_members_role_enum" NOT NULL DEFAULT 'MEMBER',
        "joinedAt"   TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_project_member"  UNIQUE ("projectId", "employeeId"),
        CONSTRAINT "PK_project_members" PRIMARY KEY ("id"),
        CONSTRAINT "FK_pm_project"      FOREIGN KEY ("projectId")
          REFERENCES "projects"("id")  ON DELETE CASCADE,
        CONSTRAINT "FK_pm_employee"     FOREIGN KEY ("employeeId")
          REFERENCES "employees"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_pm_tenant"   ON "project_members" ("tenantId")`);
    await queryRunner.query(`CREATE INDEX "IDX_pm_project"  ON "project_members" ("projectId")`);
    await queryRunner.query(`CREATE INDEX "IDX_pm_employee" ON "project_members" ("employeeId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_pm_employee"`);
    await queryRunner.query(`DROP INDEX "IDX_pm_project"`);
    await queryRunner.query(`DROP INDEX "IDX_pm_tenant"`);
    await queryRunner.query(`DROP TABLE "project_members"`);
    await queryRunner.query(`DROP TYPE "public"."project_members_role_enum"`);
  }
}
