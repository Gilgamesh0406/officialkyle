const bonusService = require("../services/bonusService");

const createBonus = async (req, res) => {
  try {
    const { code, amount, expires_at, max_claims } = req.body;

    if (!code || !amount || !expires_at || !max_claims) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const bonus = await bonusService.createBonus({
      code,
      amount,
      expires_at,
      max_claims,
    });

    res.status(201).json(bonus);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create bonus" });
  }
};

const listBonuses = async (req, res) => {
  try {
    const bonuses = await bonusService.listBonuses();
    res.status(200).json(bonuses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch bonuses" });
  }
};

const deleteBonus = async (req, res) => {
  try {
    const { id } = req.params;
    await bonusService.deleteBonus(id);
    res.status(200).json({ message: "Bonus deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete bonus" });
  }
};

const claimBonus = async (req, res) => {
  try {
    const { code } = req.params;
    const userId = req.user.id;

    const result = await bonusService.claimBonus(code, userId);
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createBonus,
  listBonuses,
  deleteBonus,
  claimBonus,
};
