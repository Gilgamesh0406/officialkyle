const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UnboxingCaseItem = sequelize.define('UnboxingCaseItem', {
    caseId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    itemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    chance: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = UnboxingCaseItem;
