const axios = require("axios");
const crypto = require("crypto");

const ItemsList = require("../models/ItemsList");
const UserItems = require("../models/UserItems");

// const Cases = require('../models/Cases');

const { getFormatAmount, roundedToFixed, time } = require("../utils/helpers");
const config = require("../config");
const UserItemsTransactions = require("../models/UserItemsTransactions");

const systemItems = {};

const loadItems = async () => {
  console.log("[ITEMS SYSTEM] Loading Items");
  const items = await ItemsList.findAll();

  items.forEach((item) => {
    systemItems[item.itemid] = {
      id: item.itemid,
      name: item.name,
      image: item.image,
      price: parseFloat(item.price),
      quality: item.quality,
      update: parseInt(item.update),
    };
  });

  console.log("[ITEMS SYSTEM] Items Loaded Successfully");
};

const loadPrices = async () => {
  console.log("[ITEMS SYSTEM] Loading Prices");

  const { steamUrl, apikey } = config.rewards.items.prices;
  const options = {
    headers: {
      "content-type": "application/json",
    },
    params: {
      key: apikey.key,
      game: "rust",
    },
  };

  try {
    const response = await axios.get(steamUrl, options);

    const prices = [];
    response.data.forEach((item) => {
      const itemid = crypto
        .createHash("md5")
        .update(item.marketname)
        .digest("hex");
      if (systemItems[itemid] && item.priceavg) {
        prices.push({
          name: item.marketname,
          price: item.priceavg,
        });
      }
    });

    await updatePrices(prices);
    console.log("[ITEMS SYSTEM] Prices Loaded Successfully");
  } catch (err) {
    console.log("[ITEMS SYSTEM] Error Loading Prices : ", err);
  }
};

const updatePrices = async (prices) => {
  for (const priceData of prices) {
    const { name, price } = priceData;
    const itemid = crypto.createHash("md5").update(name).digest("hex");

    if (price > 0) {
      await ItemsList.update({ price, update: time() }, { where: { itemid } });
    }
  }
};

const addUserItem = async (userId, itemIds, service) => {
  const addedItems = [];

  for (const itemId of itemIds) {
    const itemDetails = await ItemsList.findOne({ where: { itemid: itemId } });

    if (!itemDetails) {
      throw new Error("Item not found!");
    }

    const newItem = await UserItems.create({
      itemid: itemId,
      userid: userId,
      status: 0,
      time: time(),
    });

    if (!newItem) {
      throw new Error("User item unsuccessfully added!");
    }

    const amount = getFormatAmount(itemDetails.price);

    await UserItemsTransactions.create({
      userid: userId,
      service,
      amount,
      itemid: newItem.id,
      time: time(),
    });

    addedItems.push({
      id: newItem.id,
      itemid: itemId,
      price: itemDetails.price,
    });
  }

  return addedItems;
};

const getItemDetails = (itemId) => {
  const item = systemItems[itemId];
  if (item)
    return {
      itemid: item.id,
      name: item.name,
      image: item.image,
      price: getFormatAmount(item.price),
      quality: item.quality,
    };
  else return {};
};

const getItems = (items) => {
  let result = [];

  items.forEach((item) => {
    result.push({
      id: item.itemid,
      name: systemItems[item.itemid].name,
      image: systemItems[item.itemid].image,
      price: getFormatAmount(systemItems[item.itemid].price),
      chance: roundedToFixed(item.chance, 5),
      quality: systemItems[item.itemid].quality,
    });
  });

  return result;
};

module.exports = {
  loadItems,
  loadPrices,
  addUserItem,
  getItemDetails,
  getItems,
};
