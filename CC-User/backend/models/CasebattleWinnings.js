const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const CasebattleWinnings = sequelize.define('CasebattleWinnings', {
    id: {
        type: DataTypes.BIGINT(32),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    gameid: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    items: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(32, 2),
        allowNull: false
    },
    position: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    },
    time: {
        type: DataTypes.BIGINT(32),
        allowNull: false
    }
}, {
    tableName: 'casebattle_winnings',
    timestamps: false,
    charset: 'utf16',
    collate: 'utf16_general_ci'
});

module.exports = CasebattleWinnings;