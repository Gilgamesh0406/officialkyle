const SteamUser = require("steam-user");
const TradeOfferManager = require("steam-tradeoffer-manager");
const SteamCommunity = require("steamcommunity");
const SteamTotp = require("steam-totp");
const UserTransactions = require("../models/UserTransactions");
const UserTrade = require("../models/UserTrade");
const { Users } = require("../models");

const botConfigs = [
  {
    accountName: "imperilledex",
    password: "K88hapa5Fgh789pqlz!",
    sharedSecret: "BDYCGc2yIv4NNnW2NhHmdtmfypM=",
    apiKey: "2A8B56CBFF04827E531364937FDC7262",
  },
  {
    accountName: "3kiteowner",
    password: "Fgh789pqlz989!",
    sharedSecret: "j9PLbMtwuF5BfHZBD5cjxeJNOAY=",
    apiKey: "2A8B56CBFF04827E531364937FDC7262",
  },
  // Add more bot configurations here
];

const bots = [];

// Initialize a bot instance
const initializeBot = (config, botIndex) => {
  const client = new SteamUser();
  const manager = new TradeOfferManager({
    steam: client,
    domain: "localhost:3000",
    language: "en",
    pollInterval: 5000,
    cancelTime: 300000,
    debug: true,
  });
  const community = new SteamCommunity();

  const twoFactorCode = SteamTotp.generateAuthCode(config.sharedSecret);

  client.logOn({
    accountName: config.accountName,
    password: config.password,
    twoFactorCode,
  });

  client.on("loggedOn", () => {
    console.log(
      `Bot ${botIndex} logged in as ${client.steamID.getSteam3RenderedID()}`
    );
    client.setPersona(SteamUser.EPersonaState.Online);
  });

  client.on("webSession", (sessionID, cookies) => {
    manager.setCookies(cookies, (err) => {
      if (err) {
        console.error(`Error setting cookies for bot ${botIndex}:`, err);
        return;
      }
      console.log(`Bot ${botIndex} trade offer manager is ready.`);
    });

    community.setCookies(cookies);
  });

  client.on("error", (err) => {
    console.error(`Error for bot ${botIndex}:`, err);
  });

  manager.on("sentOfferChanged", async (offer, oldState) => {
    handleTradeOfferChange(offer, oldState, botIndex);
  });

  manager.on("newOffer", async (offer) => {
    console.log(offer);
  });

  bots.push({ client, manager, community });
};

// Handle trade offer state changes
const handleTradeOfferChange = async (offer, oldState, botIndex) => {
  const newState = offer.state;
  console.log(newState);

  switch (newState) {
    case TradeOfferManager.ETradeOfferState.Accepted:
      try {
        const acceptedTime = Date.now();
        console.log(
          `Bot ${botIndex} trade offer ${offer.id} accepted at ${acceptedTime}`
        );

        const user = await Users.findOne({
          where: { email: offer.partner.getSteamID64() },
        });

        const tradeEntry = await UserTrade.findOne({
          where: {
            tradeid: offer.id,
          },
        });
        const value = tradeEntry ? tradeEntry.value : 0;
        await UserTrade.update(
          {
            type: "Accepted",
            time: acceptedTime,
          },
          {
            where: {
              tradeid: offer.id,
            },
          }
        );

        console.log(
          `UserTrade entry for bot ${botIndex} created:`,
          tradeEntry.toJSON()
        );

        const transactionEntry = await UserTransactions.create({
          userid: user.userid,
          service: "Trade Offer Accepted",
          amount: value,
          time: acceptedTime,
        });

        console.log(
          `UserTransactions entry for bot ${botIndex} created:`,
          transactionEntry.toJSON()
        );

        await Users.increment("balance", {
          by: value,
          where: { userid: user.userid },
        });
      } catch (err) {
        console.error(`Error updating database for bot ${botIndex}:`, err);
      }
      break;

    case TradeOfferManager.ETradeOfferState.Declined:
      console.log(`Bot ${botIndex} trade offer ${offer.id} was declined.`);
      break;

    case TradeOfferManager.ETradeOfferState.InvalidItems:
      console.error(
        `Bot ${botIndex} trade offer ${offer.id} failed: invalid items.`
      );
      break;

    default:
      console.log(
        `Bot ${botIndex} trade offer ${offer.id} state changed to ${newState}`
      );
      break;
  }
};

// Calculate trade value
const calculateTradeValue = async (items, email) => {
  const inventoryResponse = await fetch(
    `https://www.steamwebapi.com/steam/api/inventory?key=Q57B3200PEOB3CE4&steam_id=${email}&game=rust&no_cache=no_cache`
  );
  const inventoryData = await inventoryResponse.json();
  let total = 0.0;
  console.log(items);
  items.map((item) => {
    const inventory = inventoryData.find((v) => v.assetid == item.assetid);
    console.log(inventory);
    if (inventory) {
      total += inventory.pricelatest;
    }
  });

  return total;
};

// Initialize all bots
botConfigs.forEach((config, index) => initializeBot(config, index));

// Export trade offer creation for a specific bot
exports.createTradeOffer = async (botIndex, steamID, items) => {
  const bot = bots[botIndex];
  if (!bot) {
    throw new Error(`Bot at index ${botIndex} not found.`);
  }

  return new Promise((resolve, reject) => {
    const offer = bot.manager.createOffer(steamID);
    console.log(steamID);
    items.forEach((item) => {
      offer.addTheirItem({
        assetid: item,
        appid: 252490,
        contextid: 2,
      });
    });

    offer.setMessage("Deposit items for credits.");

    offer.send(async (err, status) => {
      if (err) {
        console.error(
          `Error sending trade offer for bot ${botIndex}:`,
          err.message
        );
        return reject(err);
      }
      console.log(`Bot ${botIndex} trade offer sent:`, status);
      console.log(`Offer ID: ${offer.id}`); // Here is the offer ID

      const user = await Users.findOne({
        where: { email: offer.partner.getSteamID64() },
      });
      const value = await calculateTradeValue(
        offer.itemsToReceive,
        offer.partner.getSteamID64()
      );

      UserTrade.create({
        type: "Pending",
        method: "Trade Offer",
        game: "Rust",
        userid: user.userid,
        amount: offer.itemsToReceive.length,
        value: parseFloat(value).toFixed(2),
        tradeid: offer.id,
        time: Date.now()
      });
      resolve(status);
    });
  });
};
