const Admin = require("../models/Admin");
const bcrypt = require("bcrypt");

const validateUser = async (email, password) => {
  const admin = await Admin.findOne({ where: { email } });
  console.log(email);

  if (!admin) {
    return null;
  }
  const isValid = await bcrypt.compare(password, admin.password);

  if (!isValid) {
    return null;
  }

  return admin;
};

const getAdminById = async (adminId) => {
  return await Admin.findByPk(adminId);
};

module.exports = {
  validateUser,
  getAdminById,
};
