-- CreateTable
CREATE TABLE `creditcard_deposit` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `amount` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
