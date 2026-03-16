import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateProjectMembers1748000007000 implements MigrationInterface {
  name = 'CreateProjectMembers1748000007000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."workspace_members_role_enum" AS ENUM('LEAD', 'MEMBER')`,
    );

    await queryRunner.query(`
      CREATE TABLE "workspace_members" (
        "id"          uuid      NOT NULL,
        "workspaceId" uuid      NOT NULL,
        "tenantId"    uuid      NOT NULL,
        "employeeId"  uuid      NOT NULL,
        "role"        "public"."workspace_members_role_enum" NOT NULL DEFAULT 'MEMBER',
        "joinedAt"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_workspace_member"  UNIQUE ("workspaceId", "employeeId"),
        CONSTRAINT "PK_workspace_members" PRIMARY KEY ("id"),
        CONSTRAINT "FK_wm_workspace"      FOREIGN KEY ("workspaceId")
          REFERENCES "workspaces"("id")  ON DELETE CASCADE,
        CONSTRAINT "FK_wm_employee"       FOREIGN KEY ("employeeId")
          REFERENCES "employees"("id")   ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_wm_tenant"      ON "workspace_members" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_wm_workspace"   ON "workspace_members" ("workspaceId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_wm_employee"    ON "workspace_members" ("employeeId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "workspace_members"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."workspace_members_role_enum"`);
  }
}
