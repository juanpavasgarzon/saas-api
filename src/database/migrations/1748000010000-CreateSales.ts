import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSales1748000010000 implements MigrationInterface {
  name = 'CreateSales1748000010000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."sale_status_enum" AS ENUM('PENDING', 'APPROVED', 'INVOICED', 'CANCELLED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "sales" (
        "id"          uuid          NOT NULL,
        "tenantId"    uuid          NOT NULL,
        "number"      integer       NOT NULL,
        "customerId"  uuid          NOT NULL,
        "quotationId" uuid          NULL DEFAULT NULL,
        "status"      "public"."sale_status_enum" NOT NULL DEFAULT 'PENDING',
        "notes"       text          NULL DEFAULT NULL,
        "subtotal"    numeric(12,2) NOT NULL DEFAULT 0,
        "total"       numeric(12,2) NOT NULL DEFAULT 0,
        "createdAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_sales"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_sales_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_sales_tenant"        ON "sales" ("tenantId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_sales_tenant_status" ON "sales" ("tenantId", "status")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sales_tenant_status"`);
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sales_tenant"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sales"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."sale_status_enum"`);
  }
}
