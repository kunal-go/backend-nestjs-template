import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1723551575363 implements MigrationInterface {
    name = 'Init1723551575363'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user_sessions" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "ip_address" text,
                "valid_till" TIMESTAMP NOT NULL,
                "session_key_hash" text NOT NULL,
                "refresh_at" TIMESTAMP,
                "user_id" uuid NOT NULL,
                CONSTRAINT "PK_e93e031a5fed190d4789b6bfd83" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TYPE "public"."user_verification_requests_mode_enum" AS ENUM('Email', 'MobileNo')
        `);
        await queryRunner.query(`
            CREATE TABLE "user_verification_requests" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "hashed_verification_code" text NOT NULL,
                "valid_till" TIMESTAMP NOT NULL,
                "mode" "public"."user_verification_requests_mode_enum" NOT NULL,
                "user_id" uuid,
                CONSTRAINT "REL_b1a652bac0f61a568977439224" UNIQUE ("user_id"),
                CONSTRAINT "PK_97df06e71782295585ce10b9801" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "users" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "full_name" text NOT NULL,
                "email" text,
                "is_email_verified" boolean NOT NULL DEFAULT false,
                "mobile_no" text,
                "is_mobile_no_verified" boolean NOT NULL DEFAULT false,
                "hashed_password" text,
                "password_updated_at" TIMESTAMP,
                "last_login_activity_at" TIMESTAMP,
                CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
                CONSTRAINT "UQ_9ae1452b85736778c53948472b5" UNIQUE ("mobile_no"),
                CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "user_sessions"
            ADD CONSTRAINT "FK_e9658e959c490b0a634dfc54783" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "user_verification_requests"
            ADD CONSTRAINT "FK_b1a652bac0f61a568977439224e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "user_verification_requests" DROP CONSTRAINT "FK_b1a652bac0f61a568977439224e"
        `);
        await queryRunner.query(`
            ALTER TABLE "user_sessions" DROP CONSTRAINT "FK_e9658e959c490b0a634dfc54783"
        `);
        await queryRunner.query(`
            DROP TABLE "users"
        `);
        await queryRunner.query(`
            DROP TABLE "user_verification_requests"
        `);
        await queryRunner.query(`
            DROP TYPE "public"."user_verification_requests_mode_enum"
        `);
        await queryRunner.query(`
            DROP TABLE "user_sessions"
        `);
    }

}
