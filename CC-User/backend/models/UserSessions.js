const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserSessions = sequelize.define('UserSessions', {
    session: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    userid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    removed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    activated: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    expire: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'users_sessions',
    timestamps: false
});

module.exports = UserSessions;