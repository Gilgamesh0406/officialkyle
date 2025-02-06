const config = require('../config');
const { getFormatAmount } = require('./helpers');

const verifyFormatAmount = (amount, callback) => {
    if(isNaN(Number(amount)))
        return callback(new Error('Invalid amount. This field must to be a number'));

    amount = getFormatAmount(amount);

    return callback(null, amount);
}

const getSiteAlerts = () => {
    if(new Date().getDay() === 0 || new Date().getDay() === 6) {
        return config.settings.server.alerts.concat(config.chat.message_double_xp);
    }
    return config.settings.server.alerts;
}

const getSiteNotifies = () => {
    return config.settings.server.notifies;
}

module.exports = {
    getSiteAlerts,
    getSiteNotifies,
    verifyFormatAmount
}