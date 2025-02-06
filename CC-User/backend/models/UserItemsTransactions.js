const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserItemsTransactions = sequelize.define('UserItemsTransactions', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    userid: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    service: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    amount: {
        type: DataTypes.FLOAT(32, 2),
        allowNull: false
    },
    itemid: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'users_items_transactions',
    timestamps: false
});

module.exports = UserItemsTransactions;