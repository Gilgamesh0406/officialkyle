const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CoinflipBet = sequelize.define('CoinflipBet', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    userid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    xp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    gameid: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    creator: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    bot: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    time: {
        type: DataTypes.BIGINT,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'coinflip_bets',
    timestamps: false,
});

module.exports = CoinflipBet;