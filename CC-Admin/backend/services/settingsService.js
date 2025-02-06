const Setting = require("../models/Setting");

const updateSetting = async (key, value) => {
  const setting = await Setting.findOne({ where: { key } });
  if (setting) {
    setting.value = JSON.stringify(value); // Store value as string
    await setting.save();
  } else {
    await Setting.create({ key, value: JSON.stringify(value) });
  }
  return { key, value };
};

const getSetting = async (key) => {
  const setting = await Setting.findOne({ where: { key } });
  if (setting) {
    return setting;
  } else {
    await Setting.create({ key, value: "" });
    return { key, value: "" };
  }
};

module.exports = {
  updateSetting,
  getSetting,
};
