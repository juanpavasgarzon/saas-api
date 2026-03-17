import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateServices1773635839000 implements MigrationInterface {
  name = 'CreateServices1773635839000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "services" (
        "id"          uuid              NOT NULL,
        "tenantId"    character varying NOT NULL,
        "name"        character varying NOT NULL,
        "description" character varying,
        "unit"        character varying NOT NULL,
        "category"    character varying,
        "isActive"    boolean           NOT NULL DEFAULT true,
        "createdAt"   TIMESTAMP         NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP         NOT NULL DEFAULT now(),
        CONSTRAINT "PK_services" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_services_tenant" ON "services" ("tenantId")`);
    await queryRunner.query(
      `CREATE INDEX "IDX_services_tenant_isActive" ON "services" ("tenantId", "isActive")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_services_tenant_isActive"`);
    await queryRunner.query(`DROP INDEX "IDX_services_tenant"`);
    await queryRunner.query(`DROP TABLE "services"`);
  }
}
