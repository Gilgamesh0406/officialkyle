const axios = require('axios');
const config = require('../config');

const verifyRecaptcha = async (token) => {
    const { private_key, url } = config.site.recaptcha;
    const secretKey = private_key;

    const response = await axios.post(url, null, {
        params: {
          secret: secretKey,
          response: token,
        }
      });

    return response.data.success;
}

module.exports = {
    verifyRecaptcha
}