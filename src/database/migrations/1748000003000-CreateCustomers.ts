import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateCustomers1748000003000 implements MigrationInterface {
  name = 'CreateCustomers1748000003000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // email unique per tenant.
    await queryRunner.query(`
      CREATE TABLE "customers" (
        "id"            uuid      NOT NULL,
        "tenantId"      uuid      NOT NULL,
        "name"          varchar   NOT NULL,
        "email"         varchar   NOT NULL,
        "phone"         varchar   NOT NULL,
        "address"       varchar   NOT NULL,
        "contactPerson" varchar   NOT NULL,
        "isActive"      boolean   NOT NULL DEFAULT true,
        "createdAt"     TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"     TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_customers_tenant_email" UNIQUE ("tenantId", "email"),
        CONSTRAINT "PK_customers"              PRIMARY KEY ("id"),
        CONSTRAINT "FK_customers_tenant"       FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_customers_tenant"          ON "customers" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_customers_tenant_isActive" ON "customers" ("tenantId", "isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_customers_tenant_isActive"`);
    await queryRunner.query(`DROP INDEX "IDX_customers_tenant"`);
    await queryRunner.query(`DROP TABLE "customers"`);
  }
}
