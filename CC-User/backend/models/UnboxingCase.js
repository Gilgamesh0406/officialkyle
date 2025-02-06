const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UnboxingCase = sequelize.define('UnboxingCase', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});

module.exports = UnboxingCase;
