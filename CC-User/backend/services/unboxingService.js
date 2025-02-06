const { Op, Sequelize } = require("sequelize");
const Cases = require("../models/Cases");
const UnboxingBet = require("../models/UnboxingBet");
const UserItems = require("../models/UserItems");
const ItemsList = require("../models/ItemsList");
const UsersSeedServer = require("../models/UsersSeedServer");

const {
  getUserSeeds,
  generateSaltHash,
  getRoll,
  getCombinedSeed,
} = require("../utils/fair");
const {
  getFormatAmount,
  getColorByQuality,
  calculateLevel,
  time,
  countDecimals,
  roundedToFixed,
} = require("../utils/helpers");
const {
  addUserItem,
  getItemDetails,
  getItems,
} = require("../services/itemService");

const config = require("../config");
const { registerBet, updateBalance } = require("./bettingService");

let unboxingCases = {};
let lastWinnings = [];
let loadedHistory = false;

const loadCases = async () => {
  console.log("[UNBOXING] Loading Cases");

  const cases = await Cases.findAll({
    where: { removed: 0 },
  });
  cases.forEach((caseItem) => {
    const items = JSON.parse(caseItem.items);
    const offset = roundedToFixed(caseItem.offset, 2);

    let price = 0;

    items.forEach((item) => {
      price +=
        (getFormatAmount(getItemDetails(item.itemid).price) * item.chance) /
        100;
    });

    price = getFormatAmount(price * (1 + offset / 100));

    unboxingCases[caseItem.caseid] = {
      name: caseItem.name,
      image: caseItem.image,
      price,
      category: 0,
      items,
    };
  });

  console.log("[UNBOXING] Cases Loaded Successfully!");
};

const loadHistory = async () => {
  if (loadedHistory) return;

  loadedHistory = true;

  console.log("[UNBOXING] Loading history");

  const history = await UnboxingBet.findAll({
    order: [["time", "DESC"]],
    limit: 20,
  });

  lastWinnings = history.reverse().map((bet) => {
    const caseItem = unboxingCases[bet.caseid];
    const itemDetails = getItemDetails(bet.itemid);

    if (caseItem && itemDetails) {
      return {
        user: {
          userid: bet.userid,
          name: bet.name,
          avatar: bet.avatar,
          level: calculateLevel(bet.xp).level,
        },
        unboxing: {
          id: bet.caseid,
          name: caseItem.name,
          image: caseItem.image,
          price: getFormatAmount(caseItem.price),
        },
        winning: {
          name: itemDetails.name,
          image: itemDetails.image,
          price: getFormatAmount(itemDetails.price),
          chance: roundedToFixed(
            caseItem.items.filter((a) => a.itemid === bet.itemid)[0].chance,
            5
          ),
          color: getColorByQuality(itemDetails.quality),
        },
      };
    }
  });
};

const getCases = () => {
  return Object.keys(unboxingCases)
    .map((id) => {
      return {
        id,
        name: unboxingCases[id].name,
        image: unboxingCases[id].image,
        price: getFormatAmount(unboxingCases[id].price),
        items: unboxingCases[id].items,
      };
    })
    .sort((a, b) => a.price - b.price);
};

const addCase = (caseItem) => {
  unboxingCases[caseItem.caseid] = caseItem;
};
const generateTickets = (items) => {
  let decimals = 0;

  items.forEach((item) => {
    if (countDecimals(item.chance) > decimals)
      decimals = countDecimals(item.chance);
  });

  let total = 0;

  return items.map((item) => {
    const min = total + 1;
    const max = total + item.chance * Math.pow(10, decimals);
    total = max;

    return { min, max };
  });
};

const generateSpinner = (items) => {
  const tickets = generateTickets(items);
  const total = tickets[tickets.length - 1].max;

  let spinner = [];
  for (let i = 0; i < 150; i++) {
    const ticket = Math.floor(Math.random() * total) + 1;
    const item = items.find(
      (_, j) => ticket >= tickets[j].min && ticket <= tickets[j].max
    );

    spinner.push({
      name: item.name,
      image: item.image,
      price: getFormatAmount(item.price),
      chance: item.chance,
      color: getColorByQuality(item.quality),
    });
  }
  return spinner;
};

const openCase = async (user, caseId, amount, io, type) => {
  if (!unboxingCases[caseId]) {
    throw new Error("Error: Invalid case id!");
  }

  const { min, max } = config.games.games.unboxing.cases_length;

  if (isNaN(Number(amount)) || amount < min || amount > max)
    throw new Error(`Error: Invalid amount cases [${min} - ${max}]!`);

  const caseDetails = unboxingCases[caseId];
  const amountBet = getFormatAmount(caseDetails.price * amount);
  if (!user) {
    console.log("[UNBOXING] Invalid user!");
    return;
  }
  const fairData = await getUserSeeds(user.userid);
  const winnings = [];

  if (type == "unboxing") {
    await registerBet(
      user.userid,
      amountBet,
      [],
      "unboxing",
      false,
      io,
      async (err) => {
        if (err) {
          socket.emit("message", {
            type: "error",
            error: err.message,
          });
        }
        await updateBalance(user.userid, io);
      }
    );
  }

  for (let i = 0; i < amount; i++) {
    const seed = getCombinedSeed(
      fairData.serverSeed,
      fairData.clientSeed,
      fairData.nonce + i
    );
    const salt = generateSaltHash(seed);
    const items = getItems(caseDetails.items);
    const tickets = generateTickets(items);
    const total = tickets[tickets.length - 1].max;
    const roll = getRoll(salt, total) + 1;

    let winningItem;

    for (let j = 0; j < tickets.length; j++) {
      if (roll >= tickets[j].min && roll <= tickets[j].max) {
        winningItem = {
          id: items[j].id,
          name: items[j].name,
          image: items[j].image,
          price: getFormatAmount(items[j].price),
          chance: roundedToFixed(items[j].chance, 5),
          color: getColorByQuality(items[j].quality),
        };
        break;
      }
    }

    const spinner = generateSpinner(items);

    spinner[99] = winningItem;

    await incrementNonce(fairData.serverSeedId, user.userid);

    if (type == "unboxing") {
      await UnboxingBet.create({
        userid: user.userid,
        name: user.name,
        avatar: user.avatar,
        xp: user.xp,
        caseid: caseId,
        itemid: winningItem.id,
        roll,
        tickets: total,
        server_seedid: fairData.serverSeedId,
        client_seedid: fairData.clientSeedId,
        nonce: fairData.nonce + i,
        time: time(),
      });

      await addUserItem(user.userid, [winningItem.id], "unboxing");
    }

    winnings.push({ spinner, winning: winningItem });
  }

  return winnings;
};

const incrementNonce = async (serverSeedId, userId) => {
  await UsersSeedServer.update(
    { nonce: Sequelize.literal("nonce + 1") },
    { where: { id: serverSeedId, userid: userId } }
  );
};

const getHistory = () => lastWinnings;

module.exports = {
  lastWinnings,
  loadCases,
  getCases,
  addCase,
  openCase,
  loadHistory,
  unboxingCases,
  generateTickets,
  generateSpinner,
  getHistory,
};
