const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UsersSeedServer = sequelize.define('users_seed_server', {
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
    nonce: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'users_seeds_server',
    timestamps: false
});

module.exports = UsersSeedServer;