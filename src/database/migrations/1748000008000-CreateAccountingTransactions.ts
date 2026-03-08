import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateAccountingTransactions1748000008000 implements MigrationInterface {
  name = 'CreateAccountingTransactions1748000008000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."accounting_transactions_type_enum" AS ENUM('INCOME', 'EXPENSE')`,
    );

    await queryRunner.query(`
      CREATE TABLE "accounting_transactions" (
        "id"          uuid          NOT NULL,
        "tenantId"    uuid          NOT NULL,
        "type"        "public"."accounting_transactions_type_enum" NOT NULL,
        "amount"      numeric(12,2) NOT NULL,
        "description" text          NOT NULL,
        "reference"   varchar       NULL DEFAULT NULL,
        "date"        date          NOT NULL,
        "createdAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP     NOT NULL DEFAULT now(),
        CONSTRAINT "PK_accounting_transactions" PRIMARY KEY ("id"),
        CONSTRAINT "FK_accounting_tenant"       FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_accounting_tenant"      ON "accounting_transactions" ("tenantId")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_accounting_tenant_type" ON "accounting_transactions" ("tenantId", "type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_accounting_tenant_date" ON "accounting_transactions" ("tenantId", "date" DESC)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_accounting_tenant_date"`);
    await queryRunner.query(`DROP INDEX "IDX_accounting_tenant_type"`);
    await queryRunner.query(`DROP INDEX "IDX_accounting_tenant"`);
    await queryRunner.query(`DROP TABLE "accounting_transactions"`);
    await queryRunner.query(`DROP TYPE "public"."accounting_transactions_type_enum"`);
  }
}
