import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSales1748000011000 implements MigrationInterface {
  name = 'CreateSales1748000011000';

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

    await queryRunner.query(`
      CREATE TABLE "sale_items" (
        "id"          uuid          NOT NULL,
        "saleId"      uuid          NOT NULL,
        "description" varchar       NOT NULL,
        "quantity"    numeric(12,2) NOT NULL,
        "unit"        "public"."unit_of_measure_enum" NOT NULL DEFAULT 'UNIT',
        "unitPrice"   numeric(12,2) NOT NULL,
        "lineTotal"   numeric(12,2) NOT NULL,
        CONSTRAINT "PK_sale_items"      PRIMARY KEY ("id"),
        CONSTRAINT "FK_sale_items_sale" FOREIGN KEY ("saleId")
          REFERENCES "sales"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`CREATE INDEX "IDX_sale_items_sale" ON "sale_items" ("saleId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_sale_items_sale"`);
    await queryRunner.query(`DROP TABLE "sale_items"`);
    await queryRunner.query(`DROP INDEX "IDX_sales_tenant_status"`);
    await queryRunner.query(`DROP INDEX "IDX_sales_tenant"`);
    await queryRunner.query(`DROP TABLE "sales"`);
    await queryRunner.query(`DROP TYPE "public"."sale_status_enum"`);
  }
}
