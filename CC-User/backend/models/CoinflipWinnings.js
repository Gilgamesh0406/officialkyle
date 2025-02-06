const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CoinflipWinnings = sequelize.define('CoinflipWinnings', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gameid: {
        type:DataTypes.INTEGER,
        allowNull: false
    },
    position: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT,
        defaultValue: DataTypes.NOW
    },
}, {
    tableName: 'coinflip_winnings',
    timestamps: false
});

module.exports = CoinflipWinnings;