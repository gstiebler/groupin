import {MigrationInterface, QueryRunner} from "typeorm";

export class FirstMigration1627787441217 implements MigrationInterface {
    name = 'FirstMigration1627787441217'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pinned_topic" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_5ee5d46d5c00581d3bf5bb057a4" DEFAULT NEWSEQUENTIALID(), "userId" uniqueidentifier NOT NULL, "topicId" uniqueidentifier NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_5081e050ade8932f85e9f2d4c9d" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_c277f4c1799cbccb31a520ea217" DEFAULT getdate(), CONSTRAINT "PK_5ee5d46d5c00581d3bf5bb057a4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topic_latest_read" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_1741172ac1a88119525b7c689fd" DEFAULT NEWSEQUENTIALID(), "userId" uniqueidentifier NOT NULL, "topicId" uniqueidentifier NOT NULL, "latestMoment" datetime NOT NULL, CONSTRAINT "PK_1741172ac1a88119525b7c689fd" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_group" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_3c29fba6fe013ec8724378ce7c9" DEFAULT NEWSEQUENTIALID(), "userId" uniqueidentifier NOT NULL, "groupId" uniqueidentifier NOT NULL, "pinned" bit NOT NULL, "latestRead" datetime NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_20e30aa35180e317e133d753166" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_471318a199fada6c17264d61c1a" DEFAULT getdate(), CONSTRAINT "PK_3c29fba6fe013ec8724378ce7c9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_cace4a159ff9f2512dd42373760" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "externalId" nvarchar(255) NOT NULL, "notificationToken" nvarchar(255), "imgUrl" nvarchar(255), "createdAt" datetime2 NOT NULL CONSTRAINT "DF_e11e649824a45d8ed01d597fd93" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_80ca6e6ef65fb9ef34ea8c90f42" DEFAULT getdate(), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_ba01f0a3e0123651915008bc578" DEFAULT NEWSEQUENTIALID(), "text" nvarchar(255) NOT NULL, "userId" uniqueidentifier NOT NULL, "topicId" uniqueidentifier NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_19d7362db248a3df27fc29b507a" DEFAULT getdate(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "topic" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_33aa4ecb4e4f20aa0157ea7ef61" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "imgUrl" nvarchar(255), "groupId" uniqueidentifier NOT NULL, "createdById" uniqueidentifier NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_d9ecea6879424139fcf247f2f62" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_d9ede173f1792aac9ea50986869" DEFAULT getdate(), CONSTRAINT "PK_33aa4ecb4e4f20aa0157ea7ef61" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "group" ("id" uniqueidentifier NOT NULL CONSTRAINT "DF_256aa0fda9b1de1a73ee0b7106b" DEFAULT NEWSEQUENTIALID(), "name" nvarchar(255) NOT NULL, "friendlyId" nvarchar(255) NOT NULL, "imgUrl" nvarchar(255), "description" nvarchar(255) NOT NULL, "visibility" nvarchar(255) NOT NULL, "createdById" uniqueidentifier NOT NULL, "createdAt" datetime2 NOT NULL CONSTRAINT "DF_1d82a7a787f7a9cc24cff3abe74" DEFAULT getdate(), "updatedAt" datetime2 NOT NULL CONSTRAINT "DF_f01d767a686ac4c224f768be2c4" DEFAULT getdate(), CONSTRAINT "PK_256aa0fda9b1de1a73ee0b7106b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pinned_topic" ADD CONSTRAINT "FK_affbfc7f3679927a2e4207cb83c" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pinned_topic" ADD CONSTRAINT "FK_0ad0a6eb6e3bdecfd7463ee27cf" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "topic_latest_read" ADD CONSTRAINT "FK_fd93b28b56ad61b5e40d089a8f5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "topic_latest_read" ADD CONSTRAINT "FK_616dee84babda2acd743e9b3a68" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_3d6b372788ab01be58853003c93" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_group" ADD CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_446251f8ceb2132af01b68eb593" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_ba61dccaec11043afd95302f254" FOREIGN KEY ("topicId") REFERENCES "topic"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "topic" ADD CONSTRAINT "FK_3a75f2197bbc84974ac2aba1e57" FOREIGN KEY ("groupId") REFERENCES "group"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "topic" ADD CONSTRAINT "FK_59d7548ea797208240417106e2d" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "group" ADD CONSTRAINT "FK_5a1ceb121c801a21673ef1b3f36" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "group" DROP CONSTRAINT "FK_5a1ceb121c801a21673ef1b3f36"`);
        await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "FK_59d7548ea797208240417106e2d"`);
        await queryRunner.query(`ALTER TABLE "topic" DROP CONSTRAINT "FK_3a75f2197bbc84974ac2aba1e57"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_ba61dccaec11043afd95302f254"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_446251f8ceb2132af01b68eb593"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_31e541c93fdc0bb63cfde6549b7"`);
        await queryRunner.query(`ALTER TABLE "user_group" DROP CONSTRAINT "FK_3d6b372788ab01be58853003c93"`);
        await queryRunner.query(`ALTER TABLE "topic_latest_read" DROP CONSTRAINT "FK_616dee84babda2acd743e9b3a68"`);
        await queryRunner.query(`ALTER TABLE "topic_latest_read" DROP CONSTRAINT "FK_fd93b28b56ad61b5e40d089a8f5"`);
        await queryRunner.query(`ALTER TABLE "pinned_topic" DROP CONSTRAINT "FK_0ad0a6eb6e3bdecfd7463ee27cf"`);
        await queryRunner.query(`ALTER TABLE "pinned_topic" DROP CONSTRAINT "FK_affbfc7f3679927a2e4207cb83c"`);
        await queryRunner.query(`DROP TABLE "group"`);
        await queryRunner.query(`DROP TABLE "topic"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "user_group"`);
        await queryRunner.query(`DROP TABLE "topic_latest_read"`);
        await queryRunner.query(`DROP TABLE "pinned_topic"`);
    }

}