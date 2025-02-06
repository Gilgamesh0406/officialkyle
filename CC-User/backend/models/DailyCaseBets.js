const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const DailyCaseBets = sequelize.define('DailyCaseBets', {
    id: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    userid: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    avatar: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    xp: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    caseid: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    itemid: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    roll: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    tickets: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    server_seedid: {
        type: DataTypes.BIGINT(32, 0),
        allowNull: false
    },
    client_seedid: {
        type: DataTypes.BIGINT(32, 0),
        allowNull: false
    },
    nonce: {
        type: DataTypes.BIGINT(32, 0),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'dailycases_bets',
    timestamps: false
});

module.exports = DailyCaseBets;