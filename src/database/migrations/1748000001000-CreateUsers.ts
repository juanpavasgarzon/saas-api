import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateUsers1748000001000 implements MigrationInterface {
  name = 'CreateUsers1748000001000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."users_role_enum" AS ENUM('OWNER', 'ADMIN', 'USER')`,
    );

    // email is globally unique — it is the login identifier across all tenants.
    await queryRunner.query(`
      CREATE TABLE "users" (
        "id"           uuid      NOT NULL,
        "tenantId"     uuid      NOT NULL,
        "email"        varchar   NOT NULL,
        "passwordHash" varchar   NOT NULL,
        "role"         "public"."users_role_enum" NOT NULL DEFAULT 'USER',
        "isActive"     boolean   NOT NULL DEFAULT true,
        "createdAt"    TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"    TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_users_email"  UNIQUE ("email"),
        CONSTRAINT "PK_users"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_users_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_users_tenant" ON "users" ("tenantId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_users_tenant"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
