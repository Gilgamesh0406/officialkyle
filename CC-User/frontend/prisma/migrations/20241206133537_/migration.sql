-- CreateTable
CREATE TABLE `banned_ip` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `ip` TEXT NOT NULL,
    `userid` VARCHAR(24) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bonus_codes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `code` VARCHAR(256) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `uses` BIGINT NOT NULL DEFAULT 0,
    `max_uses` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `bonus_uses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `code` VARCHAR(256) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casebattle_bets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `canceled` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `bot` BIGINT NOT NULL,
    `gameid` BIGINT NOT NULL,
    `position` BIGINT NOT NULL,
    `creator` BIGINT NOT NULL DEFAULT 0,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casebattle_draws` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `gameid` BIGINT NOT NULL,
    `blockid` BIGINT NOT NULL,
    `public_seed` VARCHAR(256) NOT NULL,
    `roll` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casebattle_games` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `canceled` BOOLEAN NOT NULL DEFAULT false,
    `ended` BOOLEAN NOT NULL DEFAULT false,
    `cases` TEXT NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `mode` BIGINT NOT NULL,
    `privacy` BIGINT NOT NULL,
    `free` BIGINT NOT NULL,
    `crazy` BIGINT NOT NULL,
    `server_seed` VARCHAR(256) NOT NULL,
    `battleid` VARCHAR(24) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casebattle_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `gameid` BIGINT NOT NULL,
    `items` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casebattle_rolls` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `gameid` BIGINT NOT NULL,
    `blockid` BIGINT NOT NULL,
    `public_seed` VARCHAR(256) NOT NULL,
    `roll` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `casebattle_winnings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `gameid` BIGINT NOT NULL,
    `items` TEXT NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `position` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cases_cases` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `caseid` TEXT NOT NULL,
    `items` TEXT NOT NULL,
    `name` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `offset` DECIMAL(32, 2) NOT NULL,
    `battle` BIGINT NOT NULL DEFAULT 0,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `cases_dailycases` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `caseid` TEXT NOT NULL,
    `items` TEXT NOT NULL,
    `name` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `level` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_ignore` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `ignoreid` VARCHAR(24) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chat_messages` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `rank` BIGINT NOT NULL,
    `xp` BIGINT NOT NULL,
    `private` BOOLEAN NOT NULL DEFAULT false,
    `message` TEXT NOT NULL,
    `channel` VARCHAR(32) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coinflip_bets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `bot` BIGINT NOT NULL,
    `gameid` BIGINT NOT NULL,
    `position` BIGINT NOT NULL,
    `creator` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coinflip_games` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `canceled` BOOLEAN NOT NULL DEFAULT false,
    `ended` BOOLEAN NOT NULL DEFAULT false,
    `amount` DECIMAL(32, 2) NOT NULL,
    `server_seed` VARCHAR(256) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coinflip_rolls` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `gameid` BIGINT NOT NULL,
    `blockid` BIGINT NOT NULL,
    `public_seed` VARCHAR(256) NOT NULL,
    `roll` DOUBLE NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coinflip_winnings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `gameid` BIGINT NOT NULL,
    `position` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crypto_addresses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `address` VARCHAR(256) NOT NULL,
    `currency` VARCHAR(32) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crypto_confirmations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL DEFAULT '0',
    `listingid` BIGINT NOT NULL,
    `transactionid` BIGINT NOT NULL,
    `time` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crypto_listings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `canceled` BOOLEAN NOT NULL DEFAULT false,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `type` VARCHAR(256) NOT NULL,
    `userid` VARCHAR(24) NOT NULL DEFAULT '0',
    `address` TEXT NOT NULL,
    `currency` VARCHAR(32) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL DEFAULT 0.00,
    `time` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `crypto_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `inspected` BOOLEAN NOT NULL DEFAULT false,
    `status` BIGINT NOT NULL,
    `type` VARCHAR(256) NOT NULL,
    `userid` VARCHAR(24) NOT NULL DEFAULT '0',
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `txnid` VARCHAR(256) NULL,
    `address` TEXT NOT NULL,
    `currency` VARCHAR(32) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL DEFAULT 0.00,
    `value` DOUBLE NOT NULL DEFAULT 0,
    `exchange` DECIMAL(32, 5) NOT NULL DEFAULT 0.00000,
    `fee` DOUBLE NOT NULL DEFAULT 0,
    `time` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dailycases_bets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `caseid` TEXT NOT NULL,
    `itemid` TEXT NOT NULL,
    `roll` BIGINT NOT NULL,
    `tickets` BIGINT NOT NULL,
    `server_seedid` DECIMAL(32, 0) NOT NULL,
    `client_seedid` DECIMAL(32, 0) NOT NULL,
    `nonce` DECIMAL(32, 0) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deposit_bonuses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `bonus` BIGINT NOT NULL,
    `amount` DECIMAL(32, 5) NOT NULL DEFAULT 0.00000,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deposit_codes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `referral` VARCHAR(24) NOT NULL,
    `code` VARCHAR(256) NOT NULL,
    `uses` BIGINT NOT NULL DEFAULT 0,
    `amount` DECIMAL(32, 5) NOT NULL DEFAULT 0.00000,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `deposit_uses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `bonus` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `items_lists` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `itemid` TEXT NOT NULL,
    `name` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `price` DECIMAL(32, 2) NOT NULL,
    `quality` TEXT NOT NULL,
    `type` TEXT NULL,
    `stattrak` VARCHAR(32) NOT NULL,
    `souvenir` VARCHAR(32) NOT NULL,
    `update` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `join_referrals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `referral` VARCHAR(256) NOT NULL,
    `ip` TEXT NOT NULL,
    `location` TEXT NOT NULL,
    `agent` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `join_visitors` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `link` TEXT NOT NULL,
    `ip` TEXT NOT NULL,
    `location` TEXT NOT NULL,
    `agent` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `link_keys` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `used` BIGINT NOT NULL DEFAULT 0,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `type` VARCHAR(265) NOT NULL,
    `userid` VARCHAR(24) NOT NULL,
    `key` VARCHAR(256) NOT NULL,
    `expire` BIGINT NOT NULL,
    `created` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `link_referrals` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `referral` VARCHAR(256) NOT NULL,
    `usage` TEXT NOT NULL,
    `expire` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mailer_sents` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `email` VARCHAR(256) NOT NULL,
    `subject` TEXT NOT NULL,
    `message` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `maintenances` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `reason` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `p2p_buyers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `canceled` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `steamid` VARCHAR(17) NOT NULL,
    `apikey` VARCHAR(32) NOT NULL,
    `tradelink` TEXT NOT NULL,
    `offerid` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `p2p_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `status` BIGINT NOT NULL DEFAULT 0,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `steamid` VARCHAR(17) NOT NULL,
    `apikey` VARCHAR(32) NOT NULL,
    `tradelink` TEXT NOT NULL,
    `items` TEXT NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `game` VARCHAR(256) NOT NULL,
    `tradeofferid` VARCHAR(32) NULL,
    `time` BIGINT NOT NULL,
    `buyerid` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `plinko_bets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `game` VARCHAR(32) NOT NULL,
    `multiplier` DECIMAL(32, 2) NOT NULL,
    `roll` TEXT NOT NULL,
    `server_seedid` BIGINT NOT NULL,
    `client_seedid` BIGINT NOT NULL,
    `nonce` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rain_bets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `level` BIGINT NOT NULL,
    `winning` DECIMAL(32, 2) NOT NULL DEFAULT 0.00,
    `tickets` VARCHAR(256) NOT NULL,
    `id_rain` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rain_history` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `ended` BOOLEAN NOT NULL DEFAULT false,
    `amount` DECIMAL(32, 2) NOT NULL,
    `time_roll` BIGINT NOT NULL,
    `time_create` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `rain_tips` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `id_rain` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referral_codes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `code` VARCHAR(256) NOT NULL,
    `collected` DECIMAL(32, 2) NOT NULL DEFAULT 0.00,
    `available` DECIMAL(32, 5) NOT NULL DEFAULT 0.00000,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referral_deposited` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `referral` VARCHAR(24) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `commission` DECIMAL(32, 5) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referral_updates` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `code` VARCHAR(256) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referral_uses` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `referral` VARCHAR(24) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `referral_wagered` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `referral` VARCHAR(24) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `commission` DECIMAL(32, 5) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `security_codes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `used` BIGINT NOT NULL DEFAULT 0,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `type` VARCHAR(265) NOT NULL,
    `userid` VARCHAR(24) NOT NULL,
    `code` VARCHAR(256) NOT NULL,
    `expire` BIGINT NOT NULL,
    `created` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `steam_confirmations` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL DEFAULT '0',
    `listingid` BIGINT NOT NULL,
    `transactionid` BIGINT NOT NULL,
    `time` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `steam_inventory` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `itemid` VARCHAR(256) NOT NULL,
    `game` TEXT NOT NULL,
    `status` BIGINT NOT NULL DEFAULT 0,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `steam_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `itemid` VARCHAR(256) NOT NULL,
    `wear` DECIMAL(32, 16) NOT NULL,
    `paintindex` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `steam_listings` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `canceled` BOOLEAN NOT NULL DEFAULT false,
    `confirmed` BOOLEAN NOT NULL DEFAULT false,
    `type` VARCHAR(256) NOT NULL,
    `refill` BIGINT NOT NULL DEFAULT 0,
    `userid` VARCHAR(24) NOT NULL DEFAULT '0',
    `steamid` VARCHAR(17) NOT NULL,
    `tradelink` TEXT NOT NULL,
    `items` TEXT NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL DEFAULT 0.00,
    `game` VARCHAR(256) NOT NULL,
    `bot` BIGINT NOT NULL,
    `time` BIGINT NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `steam_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `status` BIGINT NOT NULL DEFAULT 0,
    `type` VARCHAR(256) NOT NULL,
    `refill` BIGINT NOT NULL DEFAULT 0,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `steamid` VARCHAR(17) NOT NULL,
    `items` TEXT NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `code` VARCHAR(24) NOT NULL,
    `game` VARCHAR(256) NOT NULL,
    `tradeofferid` BIGINT NOT NULL,
    `botsteamid` VARCHAR(17) NOT NULL,
    `time` BIGINT NOT NULL,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `steam_verifications` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `botsteamid` VARCHAR(17) NOT NULL,
    `tradeofferid` BIGINT NOT NULL,
    `code` VARCHAR(24) NOT NULL,
    `item` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    UNIQUE INDEX `id`(`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_messages` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `message` TEXT NOT NULL,
    `supportid` BIGINT NOT NULL,
    `response` BIGINT NOT NULL DEFAULT 0,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_receivers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `supportid` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `support_tickets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `closed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `title` VARCHAR(256) NOT NULL,
    `department` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `unboxing_bets` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `xp` BIGINT NOT NULL,
    `caseid` TEXT NOT NULL,
    `itemid` TEXT NOT NULL,
    `roll` BIGINT NOT NULL,
    `tickets` BIGINT NOT NULL,
    `server_seedid` BIGINT NOT NULL,
    `client_seedid` BIGINT NOT NULL,
    `nonce` DECIMAL(32, 0) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `bot` BOOLEAN NOT NULL DEFAULT false,
    `initialized` BOOLEAN NOT NULL DEFAULT false,
    `verified` BOOLEAN NOT NULL DEFAULT false,
    `anonymous` BOOLEAN NOT NULL DEFAULT false,
    `private` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `username` VARCHAR(256) NOT NULL,
    `email` VARCHAR(256) NULL,
    `password` VARCHAR(256) NULL,
    `name` VARCHAR(256) NOT NULL,
    `avatar` TEXT NOT NULL,
    `rank` BIGINT NOT NULL DEFAULT 0,
    `balance` DECIMAL(32, 5) NOT NULL DEFAULT 0.00000,
    `xp` BIGINT NOT NULL DEFAULT 0,
    `available` DECIMAL(32, 2) NOT NULL DEFAULT 0.00,
    `tradelink` TEXT NULL,
    `apikey` TEXT NULL,
    `exclusion` BIGINT NOT NULL DEFAULT 0,
    `deposit_count` BIGINT NOT NULL DEFAULT 0,
    `deposit_total` DECIMAL(32, 2) NOT NULL DEFAULT 0.00,
    `withdraw_count` BIGINT NOT NULL DEFAULT 0,
    `withdraw_total` DECIMAL(32, 2) NOT NULL DEFAULT 0.00,
    `time_create` BIGINT NOT NULL,

    UNIQUE INDEX `users_userid_key`(`userid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_binds` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `bind` VARCHAR(256) NOT NULL,
    `bindid` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_changes` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `change` VARCHAR(256) NOT NULL,
    `value` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_items` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `status` BIGINT NOT NULL DEFAULT 0,
    `userid` VARCHAR(24) NOT NULL,
    `itemid` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_items_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `service` VARCHAR(32) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `itemid` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_logins` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` TEXT NOT NULL,
    `userid` VARCHAR(24) NOT NULL,
    `sessionid` BIGINT NOT NULL DEFAULT 0,
    `ip` TEXT NOT NULL,
    `location` TEXT NOT NULL,
    `agent` TEXT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_restrictions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `restriction` VARCHAR(256) NOT NULL,
    `reason` VARCHAR(256) NOT NULL,
    `byuserid` VARCHAR(24) NOT NULL,
    `expire` BIGINT NOT NULL DEFAULT -1,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_rewards` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `reward` VARCHAR(256) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_seeds_client` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `seed` VARCHAR(256) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_seeds_server` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `seed` VARCHAR(256) NOT NULL,
    `nonce` BIGINT NOT NULL DEFAULT 0,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_sessions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `activated` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `session` VARCHAR(32) NOT NULL,
    `device` VARCHAR(64) NOT NULL,
    `expire` BIGINT NOT NULL,
    `created` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_trades` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(32) NOT NULL,
    `method` VARCHAR(256) NOT NULL,
    `game` VARCHAR(32) NOT NULL,
    `userid` VARCHAR(24) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `value` DOUBLE NOT NULL,
    `tradeid` BIGINT NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_transactions` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(24) NOT NULL,
    `service` VARCHAR(32) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_transfers` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `from_userid` VARCHAR(24) NOT NULL,
    `to_userid` VARCHAR(24) NOT NULL,
    `amount` DECIMAL(32, 2) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users_twofa` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `removed` BOOLEAN NOT NULL DEFAULT false,
    `activated` BOOLEAN NOT NULL DEFAULT false,
    `userid` VARCHAR(24) NOT NULL,
    `secret` VARCHAR(256) NOT NULL,
    `recover` VARCHAR(256) NOT NULL,
    `time` BIGINT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `banned_ip` ADD CONSTRAINT `banned_ip_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bonus_codes` ADD CONSTRAINT `bonus_codes_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bonus_uses` ADD CONSTRAINT `bonus_uses_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casebattle_bets` ADD CONSTRAINT `casebattle_bets_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casebattle_items` ADD CONSTRAINT `casebattle_items_gameid_fkey` FOREIGN KEY (`gameid`) REFERENCES `casebattle_games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casebattle_rolls` ADD CONSTRAINT `casebattle_rolls_gameid_fkey` FOREIGN KEY (`gameid`) REFERENCES `casebattle_games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `casebattle_winnings` ADD CONSTRAINT `casebattle_winnings_gameid_fkey` FOREIGN KEY (`gameid`) REFERENCES `casebattle_games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_ignore` ADD CONSTRAINT `chat_ignore_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `chat_messages` ADD CONSTRAINT `chat_messages_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coinflip_bets` ADD CONSTRAINT `coinflip_bets_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coinflip_rolls` ADD CONSTRAINT `coinflip_rolls_gameid_fkey` FOREIGN KEY (`gameid`) REFERENCES `coinflip_games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `coinflip_winnings` ADD CONSTRAINT `coinflip_winnings_gameid_fkey` FOREIGN KEY (`gameid`) REFERENCES `coinflip_games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crypto_addresses` ADD CONSTRAINT `crypto_addresses_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crypto_confirmations` ADD CONSTRAINT `crypto_confirmations_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crypto_listings` ADD CONSTRAINT `crypto_listings_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `crypto_transactions` ADD CONSTRAINT `crypto_transactions_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dailycases_bets` ADD CONSTRAINT `dailycases_bets_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deposit_bonuses` ADD CONSTRAINT `deposit_bonuses_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deposit_codes` ADD CONSTRAINT `deposit_codes_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `deposit_uses` ADD CONSTRAINT `deposit_uses_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `link_keys` ADD CONSTRAINT `link_keys_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `link_referrals` ADD CONSTRAINT `link_referrals_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mailer_sents` ADD CONSTRAINT `mailer_sents_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `maintenances` ADD CONSTRAINT `maintenances_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p2p_buyers` ADD CONSTRAINT `p2p_buyers_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p2p_transactions` ADD CONSTRAINT `p2p_transactions_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `p2p_transactions` ADD CONSTRAINT `p2p_transactions_buyerid_fkey` FOREIGN KEY (`buyerid`) REFERENCES `p2p_buyers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plinko_bets` ADD CONSTRAINT `plinko_bets_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plinko_bets` ADD CONSTRAINT `plinko_bets_server_seedid_fkey` FOREIGN KEY (`server_seedid`) REFERENCES `users_seeds_server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `plinko_bets` ADD CONSTRAINT `plinko_bets_client_seedid_fkey` FOREIGN KEY (`client_seedid`) REFERENCES `users_seeds_client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rain_bets` ADD CONSTRAINT `rain_bets_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `rain_tips` ADD CONSTRAINT `rain_tips_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `referral_codes` ADD CONSTRAINT `referral_codes_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `referral_deposited` ADD CONSTRAINT `referral_deposited_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `referral_updates` ADD CONSTRAINT `referral_updates_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `referral_uses` ADD CONSTRAINT `referral_uses_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `referral_wagered` ADD CONSTRAINT `referral_wagered_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `security_codes` ADD CONSTRAINT `security_codes_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `steam_confirmations` ADD CONSTRAINT `steam_confirmations_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `steam_listings` ADD CONSTRAINT `steam_listings_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `steam_transactions` ADD CONSTRAINT `steam_transactions_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `steam_verifications` ADD CONSTRAINT `steam_verifications_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_messages` ADD CONSTRAINT `support_messages_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_receivers` ADD CONSTRAINT `support_receivers_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `support_tickets` ADD CONSTRAINT `support_tickets_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unboxing_bets` ADD CONSTRAINT `unboxing_bets_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unboxing_bets` ADD CONSTRAINT `unboxing_bets_server_seedid_fkey` FOREIGN KEY (`server_seedid`) REFERENCES `users_seeds_server`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `unboxing_bets` ADD CONSTRAINT `unboxing_bets_client_seedid_fkey` FOREIGN KEY (`client_seedid`) REFERENCES `users_seeds_client`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_binds` ADD CONSTRAINT `users_binds_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_changes` ADD CONSTRAINT `users_changes_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_items` ADD CONSTRAINT `users_items_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_items_transactions` ADD CONSTRAINT `users_items_transactions_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_logins` ADD CONSTRAINT `users_logins_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_logins` ADD CONSTRAINT `users_logins_sessionid_fkey` FOREIGN KEY (`sessionid`) REFERENCES `users_sessions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_restrictions` ADD CONSTRAINT `users_restrictions_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_restrictions` ADD CONSTRAINT `users_restrictions_byuserid_fkey` FOREIGN KEY (`byuserid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_rewards` ADD CONSTRAINT `users_rewards_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_seeds_client` ADD CONSTRAINT `users_seeds_client_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_seeds_server` ADD CONSTRAINT `users_seeds_server_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_sessions` ADD CONSTRAINT `users_sessions_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_trades` ADD CONSTRAINT `users_trades_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_transactions` ADD CONSTRAINT `users_transactions_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_transfers` ADD CONSTRAINT `users_transfers_from_userid_fkey` FOREIGN KEY (`from_userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_transfers` ADD CONSTRAINT `users_transfers_to_userid_fkey` FOREIGN KEY (`to_userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_twofa` ADD CONSTRAINT `users_twofa_userid_fkey` FOREIGN KEY (`userid`) REFERENCES `users`(`userid`) ON DELETE RESTRICT ON UPDATE CASCADE;
