const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChatMessage = sequelize.define('ChatMessage', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    deleted: {
        type: DataTypes.BIGINT,
        defaultValue: 0
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
    rank: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    xp: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    private: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    channel: {
        type: DataTypes.STRING(32),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
}, {
    tableName: 'chat_messages',
    timestamps: false
});

module.exports = ChatMessage;