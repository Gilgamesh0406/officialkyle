const Bonus = require("../models/Bonus");
const BonusClaim = require("../models/BonusClaim");
const User = require("../models/User");
const { Op } = require("sequelize");

const createBonus = async (bonusData) => {
  return await Bonus.create(bonusData);
};

const listBonuses = async () => {
  const bonuses = await Bonus.findAll({
    order: [["createdAt", "DESC"]],
  });

  const bonusesWithClaims = await Promise.all(
    bonuses.map(async (bonus) => {
      const claims = await BonusClaim.findAll({
        where: { bonus_id: bonus.id },
        include: [
          {
            model: User,
            attributes: ["id", "userid", "name", "avatar"],
          },
        ],
      });

      const users = claims.map((claim) => ({
        userid: claim.User.userid,
        name: claim.User.name,
        avatar: claim.User.avatar,
        claimed_at: claim.claimed_at,
      }));

      return {
        ...bonus.toJSON(),
        users,
      };
    })
  );

  return bonusesWithClaims;
};

const deleteBonus = async (id) => {
  await BonusClaim.destroy({ where: { bonus_id: id } });
  await Bonus.destroy({ where: { id } });
};

const claimBonus = async (code, userId) => {
  const bonus = await Bonus.findOne({
    where: {
      code,
      expires_at: { [Op.gt]: new Date() },
    },
  });

  if (!bonus) {
    throw new Error("Invalid or expired bonus code");
  }

  const existingClaim = await BonusClaim.findOne({
    where: { bonus_id: bonus.id, user_id: userId },
  });

  if (existingClaim) {
    throw new Error("You have already claimed this bonus");
  }

  const claimsCount = await BonusClaim.count({
    where: { bonus_id: bonus.id },
  });

  if (claimsCount >= bonus.max_claims) {
    throw new Error("This bonus has reached its maximum claims");
  }

  await BonusClaim.create({
    bonus_id: bonus.id,
    user_id: userId,
  });

  // Add bonus amount to user's balance
  await User.increment("balance", {
    by: bonus.amount,
    where: { id: userId },
  });

  return {
    message: "Bonus claimed successfully",
    amount: bonus.amount,
  };
};

module.exports = {
  createBonus,
  listBonuses,
  deleteBonus,
  claimBonus,
};
