const settings = require('./settings.json');
const siteConfig = require('./site');
const databaseConfig = require('./db');
const gamesConfig = require('./game');
const chatConfig = require('./chat');
const mailerConfig = require('./mailer');
const rewardsConfig = require('./reward');
const tradeConfig = require('./trade');

const config = {
    settings,
    site: siteConfig,
    database: databaseConfig,
    games: gamesConfig,
    chat: chatConfig,
    mailer: mailerConfig,
    rewards: rewardsConfig,
    trade: tradeConfig
};

module.exports = config;