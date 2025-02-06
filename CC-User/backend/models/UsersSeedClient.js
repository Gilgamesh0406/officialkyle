const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UsersSeedClient = sequelize.define('users_seed_client', {
    id: {
        type: DataTypes.BIGINT(32),
        primaryKey: true,
        autoIncrement: true
    },
    removed: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    userid: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    seed: {
        type: DataTypes.STRING(256),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'users_seeds_client',
    timestamps: false
});

module.exports = UsersSeedClient;