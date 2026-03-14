import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateCompanies1748000000000 implements MigrationInterface {
  name = 'CreateCompanies1748000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."companies_plan_enum" AS ENUM('STARTER', 'GROWTH', 'BUSINESS')`,
    );

    await queryRunner.query(`
      CREATE TABLE "companies" (
        "id"        uuid         NOT NULL,
        "name"      varchar(255) NOT NULL,
        "slug"      varchar(255) NOT NULL,
        "plan"      "public"."companies_plan_enum" NOT NULL DEFAULT 'STARTER',
        "logo"      text         NULL DEFAULT NULL,
        "isActive"  boolean      NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP    NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP    NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_companies_slug" UNIQUE ("slug"),
        CONSTRAINT "PK_companies"      PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "companies"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."companies_plan_enum"`);
  }
}
