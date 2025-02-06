const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CasebattleDraws = sequelize.define('CasebattleDraws', {
    id: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    removed: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    gameid: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    blockid: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    public_seed: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    roll: {
        type: DataTypes.TEXT(32),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'casebattle_draws',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = CasebattleDraws;