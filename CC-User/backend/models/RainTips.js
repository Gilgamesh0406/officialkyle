const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const RainTips = sequelize.define('RainTips', {
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
    tableName: 'rain_tips',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = RainTips;