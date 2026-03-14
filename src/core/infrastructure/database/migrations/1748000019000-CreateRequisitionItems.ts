import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateRequisitionItems1748000019000 implements MigrationInterface {
  name = 'CreateRequisitionItems1748000019000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "requisition_items" (
        "id"            uuid                    NOT NULL,
        "requisitionId" uuid                    NOT NULL,
        "itemType"      "line_item_type_enum"   NOT NULL,
        "itemId"        uuid                    NOT NULL,
        "description"   varchar                 NOT NULL,
        "quantity"      numeric(10,2)           NOT NULL,
        "unitPrice"     numeric(12,2)           NOT NULL,
        "lineTotal"     numeric(12,2)           NOT NULL,
        CONSTRAINT "PK_requisition_items"             PRIMARY KEY ("id"),
        CONSTRAINT "FK_requisition_items_requisition" FOREIGN KEY ("requisitionId")
          REFERENCES "requisitions"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "requisition_items"`);
  }
}
