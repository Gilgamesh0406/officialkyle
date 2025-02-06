const jwt = require('jsonwebtoken');
const User = require('../models/Users');

exports.login = async (credentials) => {
    const user = await User.findOne({ where: { username: credentials.username } });
    if (!user || !user.isValidPassword(credentials.password)) {
        throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

// other methods...
