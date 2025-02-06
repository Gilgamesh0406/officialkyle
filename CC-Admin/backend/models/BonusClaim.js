const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const User = require("./User");

const BonusClaim = sequelize.define(
  "BonusClaim",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    bonus_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "bonuses",
        key: "id",
      },
    },
    user_id: {
      type: DataTypes.STRING(24),
      allowNull: false,
      references: {
        model: "users",
        key: "userid",
      },
    },
    claimed_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "bonusclaims",
    charset: "utf8mb4",
    collate: "utf8mb4_unicode_ci",
  }
);

BonusClaim.belongsTo(User, { foreignKey: "user_id" });

module.exports = BonusClaim;
