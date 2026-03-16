import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateInboxMessages1773635840000 implements MigrationInterface {
  name = 'CreateInboxMessages1773635840000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."inbox_message_status_enum" AS ENUM('RECEIVED', 'PROCESSED', 'FAILED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "inbox_messages" (
        "id"          uuid        NOT NULL,
        "messageId"   varchar     NOT NULL,
        "consumer"    varchar     NOT NULL,
        "eventName"   varchar     NOT NULL,
        "payload"     jsonb       NOT NULL,
        "status"      "public"."inbox_message_status_enum" NOT NULL DEFAULT 'RECEIVED',
        "lastError"   text        NULL,
        "processedAt" TIMESTAMP   NULL,
        "createdAt"   TIMESTAMP   NOT NULL DEFAULT now(),
        "updatedAt"   TIMESTAMP   NOT NULL DEFAULT now(),
        CONSTRAINT "PK_inbox_messages" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_inbox_messageId_consumer" UNIQUE ("messageId", "consumer")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_inbox_messages_status" ON "inbox_messages" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_inbox_messages_messageId_consumer" ON "inbox_messages" ("messageId", "consumer")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "inbox_messages"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."inbox_message_status_enum"`);
  }
}
