import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class CreateOutboxMessages1748000028000 implements MigrationInterface {
  name = 'CreateOutboxMessages1748000028000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."outbox_message_status_enum" AS ENUM('PENDING', 'SENT', 'FAILED')`,
    );

    await queryRunner.query(`
      CREATE TABLE "outbox_messages" (
        "id"        uuid      NOT NULL,
        "eventName" varchar   NOT NULL,
        "payload"   jsonb     NOT NULL,
        "status"    "public"."outbox_message_status_enum" NOT NULL DEFAULT 'PENDING',
        "attempts"  integer   NOT NULL DEFAULT 0,
        "lastError" text      NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_outbox_messages" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE INDEX "IDX_outbox_messages_status"  ON "outbox_messages" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_outbox_messages_created" ON "outbox_messages" ("createdAt")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "outbox_messages"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "public"."outbox_message_status_enum"`);
  }
}
