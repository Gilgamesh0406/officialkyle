const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CoinflipRoll = sequelize.define('CoinflipRoll', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    gameid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    blockid: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    public_seed: {
        type: DataTypes.STRING,
        allowNull: false
    },
    roll: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'coinflip_rolls',
    timestamps: false
});

module.exports = CoinflipRoll;