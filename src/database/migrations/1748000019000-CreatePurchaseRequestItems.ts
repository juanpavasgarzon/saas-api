import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreatePurchaseRequestItems1748000019000 implements MigrationInterface {
  name = 'CreatePurchaseRequestItems1748000019000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "purchase_request_items" (
        "id"                uuid          NOT NULL,
        "purchaseRequestId" uuid          NOT NULL,
        "description"       varchar       NOT NULL,
        "quantity"          numeric(10,2) NOT NULL,
        "unitPrice"         numeric(12,2) NOT NULL,
        "lineTotal"         numeric(12,2) NOT NULL,
        CONSTRAINT "PK_purchase_request_items"                  PRIMARY KEY ("id"),
        CONSTRAINT "FK_purchase_request_items_purchase_request" FOREIGN KEY ("purchaseRequestId")
          REFERENCES "purchase_requests"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_purchase_request_items_request" ON "purchase_request_items" ("purchaseRequestId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "IDX_purchase_request_items_request"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "purchase_request_items"`);
  }
}
