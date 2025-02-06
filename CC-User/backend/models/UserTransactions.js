const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserTransactions = sequelize.define('UserTransactions', {
    id: {
        type: DataTypes.BIGINT(32),
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
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'users_transactions',
    timestamps: false
})

module.exports = UserTransactions;