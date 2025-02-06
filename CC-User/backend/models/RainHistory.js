const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RainHistory = sequelize.define('RainHistory', {
    id: {
        type: DataTypes.BIGINT(32),
        primaryKey: true,
        autoIncrement: true
    },
    ended: {
        type: DataTypes.BIGINT(32),
        allowNull: true
    },
    amount: {
        type: DataTypes.INTEGER(32),
        allowNull: true
    },
    time_roll: {
        type: DataTypes.BIGINT(32),
        allowNull: true
    },
    time_create: {
        type: DataTypes.BIGINT(32),
        allowNull: true
    }
}, {
    tableName: 'rain_history',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = RainHistory;