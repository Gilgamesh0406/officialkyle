const authService = require("../services/authService");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await authService.validateUser(email, password);

    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log(admin);
    const token = jwt.sign(
      {
        id: admin.id,
        userid: admin.userid,
        name: admin.name,
        avatar: admin.avatar,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      user: {
        id: admin.id,
        userid: admin.userid,
        name: admin.name,
        email: admin.email,
        avatar: admin.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

const validateToken = async (req, res) => {
  try {
    // The user data is already attached by the middleware
    const admin = await authService.getAdminById(req.user.adminid);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      id: admin.id,
      userid: admin.userid,
      name: admin.name,
      email: admin.email,
      avatar: admin.avatar,
      role: admin.role,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Token validation failed" });
  }
};

module.exports = {
  login,
  validateToken,
};
