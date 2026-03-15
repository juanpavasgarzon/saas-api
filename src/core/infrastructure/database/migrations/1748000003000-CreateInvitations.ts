import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInvitations1748000003000 implements MigrationInterface {
  name = 'CreateInvitations1748000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."invitations_status_enum" AS ENUM('PENDING', 'ACCEPTED', 'EXPIRED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "invitations" (
        "id"        uuid      NOT NULL,
        "tenantId"  uuid      NOT NULL,
        "email"     varchar   NOT NULL,
        "role"      varchar   NOT NULL,
        "token"     varchar   NOT NULL,
        "url"       varchar   NOT NULL,
        "status"    "public"."invitations_status_enum" NOT NULL DEFAULT 'PENDING',
        "expiresAt" TIMESTAMP NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_invitations_token"  UNIQUE ("token"),
        CONSTRAINT "PK_invitations"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_invitations_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_invitations_tenant"       ON "invitations" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_invitations_tenant_email" ON "invitations" ("tenantId", "email")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "invitations"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."invitations_status_enum"`);
  }
}
