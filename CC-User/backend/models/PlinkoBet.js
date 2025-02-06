const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const PlinkoBet = sequelize.define('PlinkoBet', {
    id: {
        type: DataTypes.BIGINT(32),
        primaryKey: true,
        autoIncrement: true
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
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    game: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    multiplier: {
        type: DataTypes.DECIMAL(32, 2),
        allowNull: false
    },
    roll: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    server_seedid: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    client_seedid: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    nonce: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'plinko_bets',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = PlinkoBet;
