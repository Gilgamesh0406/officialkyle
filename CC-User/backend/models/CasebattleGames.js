const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CasebattleGames = sequelize.define('CasebattleGames', {
    id: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    canceled: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    ended: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    cases: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(32, 2),
        allowNull: false
    },
    mode: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    privacy: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    free: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    crazy: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    server_seed: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    battleid: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'casebattle_games',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = CasebattleGames;