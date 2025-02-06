const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CoinflipGame = sequelize.define('CoinflipGame', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    server_seed: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    ended: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    canceled: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    time: {
        type: DataTypes.BIGINT,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'coinflip_games',
    timestamps: false,
});

module.exports = CoinflipGame;
