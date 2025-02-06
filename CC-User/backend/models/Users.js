const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Users = sequelize.define('Users', {
    userid: {
        type: DataTypes.STRING,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    anonymous: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    avatar: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    balance: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    bot: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: false
    },
    rank: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    xp: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tradelink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    apikey: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    initialized: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    available: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0,
    },
    private: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    exclusion: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
    },
    deposit_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    deposit_total: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
    withdraw_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    withdraw_total: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
    },
}, {
    tableName: 'users',
    timestamps: false,
});

module.exports = Users;
