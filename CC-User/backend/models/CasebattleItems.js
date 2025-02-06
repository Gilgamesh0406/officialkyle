const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const CasebattleItems = sequelize.define('CasebattleItems', {
    id: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    gameid: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    items: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'casebattle_items',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = CasebattleItems;