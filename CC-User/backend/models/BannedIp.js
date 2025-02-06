module.exports = (sequelize, DataTypes) => {
    const BannedIp = sequelize.define('BannedIp', {
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
        ip: {
            type: DataTypes.TEXT,
            allowNull: false
        },
        userid: {
            type: DataTypes.STRING(24),
            allowNull: false
        },
        time: {
            type: DataTypes.BIGINT(32),
            allowNull: false
        }
    }, {
        tableName: 'bannedip',
        timestamps: false,
        charset: 'utf16',
        collate: 'utf16_general_ci'
    });
    return BannedIp;
};
