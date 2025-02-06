const Users = require("./Users");
const CoinflipGame = require("./CoinflipGame");
const CoinflipBet = require("./CoinflipBet");
const CoinflipWinnings = require("./CoinflipWinnings");
const UserItems = require("./UserItems");
const ItemsList = require("./ItemsList");
const CasebattleGames = require("./CasebattleGames");
const CasebattleBets = require("./CasebattleBets");
const UserDiscordLink = require("./UserDiscordLink");

// User has many CoinflipBets
Users.hasMany(CoinflipBet, { foreignKey: "userid" });
CoinflipBet.belongsTo(Users, { foreignKey: "userid" });

// CoinflipGame has many CoinflipBets
CoinflipGame.hasMany(CoinflipBet, { foreignKey: "gameid" });
CoinflipBet.belongsTo(CoinflipGame, { foreignKey: "gameid" });

// CoinflipGame has many CoinflipWinnings
CoinflipGame.hasMany(CoinflipWinnings, { foreignKey: "gameid" });
CoinflipWinnings.belongsTo(CoinflipGame, { foreignKey: "gameid" });

// CoinflipBet has one CoinflipWinnings
CoinflipBet.hasOne(CoinflipWinnings, {
  foreignKey: "gameid",
  sourceKey: "gameid",
});
CoinflipWinnings.belongsTo(CoinflipBet, {
  foreignKey: "gameid",
  targetKey: "gameid",
});

UserItems.belongsTo(ItemsList, {
  foreignKey: "itemid",
  targetKey: "itemid",
  as: "itemDetails",
});
ItemsList.hasMany(UserItems, { foreignKey: "itemid" });

// CasebattleGames has many CasebattleBets
CasebattleGames.hasMany(CasebattleBets, { foreignKey: "gameid" });
CasebattleBets.belongsTo(CasebattleGames, { foreignKey: "gameid" });

module.exports = {
  Users,
  CoinflipGame,
  CoinflipBet,
  CoinflipWinnings,
  UserItems,
  ItemsList,
  CasebattleGames,
  CasebattleBets,
  UserDiscordLink,
};
