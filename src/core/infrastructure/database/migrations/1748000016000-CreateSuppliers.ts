import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateSuppliers1748000016000 implements MigrationInterface {
  name = 'CreateSuppliers1748000016000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "suppliers" (
        "id"                   uuid      NOT NULL,
        "tenantId"             uuid      NOT NULL,
        "name"                 varchar   NOT NULL,
        "company"              varchar   NULL DEFAULT NULL,
        "identificationNumber" varchar   NOT NULL DEFAULT '',
        "email"                varchar   NOT NULL,
        "phone"                varchar   NOT NULL DEFAULT '',
        "address"              varchar   NOT NULL DEFAULT '',
        "contactPerson"        varchar   NULL DEFAULT NULL,
        "isActive"             boolean   NOT NULL DEFAULT true,
        "createdAt"            TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt"            TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_suppliers"        PRIMARY KEY ("id"),
        CONSTRAINT "FK_suppliers_tenant" FOREIGN KEY ("tenantId")
          REFERENCES "companies"("id") ON DELETE CASCADE
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_suppliers_tenant" ON "suppliers" ("tenantId")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "suppliers"`);
  }
}
