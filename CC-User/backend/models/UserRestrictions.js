const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UserRestrictions = sequelize.define('UserRestrictions', {
    userid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    removed: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0
    },
    restriction: {
        type: DataTypes.STRING,
        allowNull: false
    },
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    byuserid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    expire: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: 'users_restrictions',
    timestamps: false
});

module.exports = UserRestrictions;