const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserTrade = sequelize.define('UserTrade', {
    id: {
        type: DataTypes.BIGINT(32),
        primaryKey: true,
        autoIncrement: true
    },
    type: {
        type: DataTypes.STRING(32)
    },
    method: {
        type: DataTypes.STRING(256)
    },
    game: {
        type: DataTypes.STRING(32)
    },
    userid: {
        type: DataTypes.STRING(24)
    },
    amount: {
        type: DataTypes.FLOAT(32, 2)
    },
    value: {
        type: DataTypes.FLOAT(32, 2)
    },
    tradeid: {
        type: DataTypes.BIGINT(20)
    },
    time: {
        type: DataTypes.DOUBLE(32)
    }
}, {
    tableName: 'users_trades',
    timestamps: false
})

module.exports = UserTrade;