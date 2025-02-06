const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const UnboxingItem = sequelize.define('UnboxingItem', {
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
    quality: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = UnboxingItem;
