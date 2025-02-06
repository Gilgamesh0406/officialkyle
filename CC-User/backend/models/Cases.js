const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Cases = sequelize.define('Cases', {
    id: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    removed: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    caseid: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    items: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    image: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    offset: {
        type: DataTypes.DECIMAL(32, 2),
        allowNull: false
    },
    battle: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        defaultValue: 0
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'cases_cases',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = Cases;