const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RainBets = sequelize.define('RainBets', {
    id: {
        type: DataTypes.BIGINT(32),
        primaryKey: true,
        autoIncrement: true
    },
    userid: {
        type: DataTypes.STRING(24),
        allowNull: true
    },
    amount: {
        type: DataTypes.INTEGER(32),
        allowNull: true
    },
    id_rain: {
        type: DataTypes.BIGINT(32),
        allowNull: true
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: true
    }
}, {
    tableName: 'rain_bets',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = RainBets;