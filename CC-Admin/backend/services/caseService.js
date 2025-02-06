const { Op } = require("sequelize");
const ItemsList = require("../models/ItemsList");
const Cases = require("../models/Cases");
const DailyCases = require("../models/DailyCases");
const BlockedSkin = require("../models/BlockedSkin");

const getItemList = async (query) => {
  const { searchTerm, page, rowsPerPage } = query;

  const currentPage = parseInt(page) + 1 || 1;
  const itemsPerPage = parseInt(rowsPerPage) || 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const blockedSkins = await BlockedSkin.findAll();

  const items = await ItemsList.findAndCountAll({
    where: {
      name: { [Op.like]: `%${searchTerm}%` },
    },
    limit: itemsPerPage,
    offset: offset,
  });

  const itemsWithBlockedStatus = items.rows.map((item) => {
    let blocked = false;

    blockedSkins.forEach((block) => {
      if (block.blockMethod === "name" && item.name === block.blockValue) {
        blocked = true;
      } else if (
        block.blockMethod === "value" &&
        parseFloat(item.price) < parseFloat(block.blockValue)
      ) {
        blocked = true;
      }
    });

    return { ...item.toJSON(), blocked };
  });

  return { ...items, rows: itemsWithBlockedStatus };
};

const getCase = async (caseid) => {
  const casee = await Cases.findOne({ where: { caseid, removed: 0 } });
  const dailyCase = await DailyCases.findOne({ where: { caseid, removed: 0 } });
  let items = casee
    ? JSON.parse(casee.dataValues.items)
    : JSON.parse(dailyCase.dataValues.items);
  for (let index = 0; index < items.length; index++) {
    const v = items[index];
    const item = await ItemsList.findOne({ where: { itemid: v.itemid } });
    items[index].price = item.dataValues.price;
  }
  return casee
    ? {
        ...casee.dataValues,
        items: JSON.stringify(items),
        type: "unboxing",
      }
    : {
        ...dailyCase.dataValues,
        items: JSON.stringify(items),
        type: "daily",
        offset: 0,
        battle: 0,
      };
};

const getCaseList = async (query) => {
  const { searchTerm, page, rowsPerPage, caseType } = query;

  const currentPage = parseInt(page) + 1 || 1;
  const itemsPerPage = parseInt(rowsPerPage) || 10;
  const offset = (currentPage - 1) * itemsPerPage;

  const searchCondition = {
    where: {
      name: {
        [Op.like]: `%${searchTerm}%`,
      },
      removed: 0,
    },
  };

  const result =
    caseType === "unboxing"
      ? await Cases.findAndCountAll({
          ...searchCondition,
          limit: itemsPerPage,
          offset,
        })
      : await DailyCases.findAndCountAll({
          ...searchCondition,
          limit: itemsPerPage,
          offset,
        });
  for (let i = 0; i < result.rows.length; i++) {
    let price = 0;
    const items = JSON.parse(result.rows[i].dataValues.items);
    for (let j = 0; j < items.length; j++) {
      const item = await ItemsList.findOne({
        where: { itemid: items[j].itemid },
      });
      price += (item.dataValues.price * items[j].chance) / 100;
    }
    result.rows[i].dataValues.price =
      price *
      (1 +
        (result.rows[i].dataValues.offset
          ? result.rows[i].dataValues.offset
          : 0) /
          100);
  }
  return result;
};

const generateUniqueCaseId = () => {
  let caseid;
  const timestamp = Date.now().toString(36); // Convert to base-36 (alphanumeric)

  // Add randomness to avoid collisions within the same millisecond
  const randomPart = Math.random().toString(36).substring(2, 4); // Two random characters

  // Combine timestamp and random part to create an 8-character caseid
  caseid = `${timestamp}${randomPart}`.substring(0, 8);
  return caseid;
};
const addCase = async (data) => {
  if (data.type === "unboxing")
    return await Cases.create({
      name: data.name,
      image: data.image,
      items: JSON.stringify(data.rustSkins),
      battle: data.canBattle,
      offset: data.priceOffset,
      removed: 0,
      caseid: generateUniqueCaseId(),
      time: Date.now(),
    });
  else
    return await DailyCases.create({
      name: data.name,
      image: data.image,
      items: JSON.stringify(data.rustSkins),
      removed: 0,
      level: 1,
      time: Date.now(),
      caseid: generateUniqueCaseId(),
    });
};
const updateCase = async (caseid, data) => {
  if (data.type === "unboxing")
    return await Cases.update(
      {
        name: data.name,
        image: data.image,
        items: JSON.stringify(data.rustSkins),
        battle: data.canBattle,
        offset: data.priceOffset,
        removed: 0,
        time: Date.now(),
      },
      {
        where: { caseid },
      }
    );
  else
    return await DailyCases.update(
      {
        name: data.name,
        image: data.image,
        items: JSON.stringify(data.rustSkins),
        removed: 0,
        level: 1,
        time: Date.now(),
      },
      {
        where: { caseid },
      }
    );
};

const deleteCase = async (caseid) => {
  await Cases.update({ removed: 1 }, { where: { caseid } });
  await DailyCases.update({ removed: 1 }, { where: { caseid } });
  return "success";
};

module.exports = {
  getItemList,
  getCaseList,
  getCase,
  addCase,
  updateCase,
  deleteCase,
};
