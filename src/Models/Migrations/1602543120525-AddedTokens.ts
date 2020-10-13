import {MigrationInterface, QueryRunner} from "typeorm";

export class AddedTokens1602543120525 implements MigrationInterface {
    name = 'AddedTokens1602543120525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `cart` DROP COLUMN `archivedAt`");
        await queryRunner.query("ALTER TABLE `customer` ADD `isConfirmed` tinyint NOT NULL DEFAULT 0");
        await queryRunner.query("ALTER TABLE `product` CHANGE `secondPrice` `secondPrice` float(12) NULL DEFAULT NULL");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `product` CHANGE `secondPrice` `secondPrice` float(12) NULL");
        await queryRunner.query("ALTER TABLE `customer` DROP COLUMN `isConfirmed`");
        await queryRunner.query("ALTER TABLE `cart` ADD `archivedAt` datetime NOT NULL");
    }

}
