const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CasebattleBets = sequelize.define('CasebattleBets', {
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
    bot: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    gameid: {
        type: DataTypes.BIGINT(24),
        allowNull: false
    },
    position: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    creator: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'casebattle_bets',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = CasebattleBets;