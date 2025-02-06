const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserItems = sequelize.define('UserItems', {
    id: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    status: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    userid: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    itemid: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'users_items',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = UserItems;