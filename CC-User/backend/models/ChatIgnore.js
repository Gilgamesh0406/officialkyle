const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const ChatIgnore = sequelize.define('ChatIgnore', {
    id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true
    },
    removed: {
        type: DataTypes.BIGINT,
        defaultValue: 0
    },
    userid: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    ignoreid: {
        type: DataTypes.STRING(24),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'chat_ignore',
    timestamps: false
});

module.exports = ChatIgnore;