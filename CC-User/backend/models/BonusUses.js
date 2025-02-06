// models/bonus_uses.js
module.exports = (sequelize, DataTypes) => {
    const BonusUses = sequelize.define('BonusUses', {
        id: {
            type: DataTypes.BIGINT(32),
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        userid: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        code: {
            type: DataTypes.STRING(256),
            allowNull: false
        },
        amount: {
            type: DataTypes.DECIMAL(32, 2),
            allowNull: false
        },
        time: {
            type: DataTypes.BIGINT(32),
            allowNull: false
        }
    }, {
        tableName: 'bonus_uses',
        timestamps: false,
        charset: 'utf16',
        collate: 'utf16_general_ci'
    });
    return BonusUses;
};
