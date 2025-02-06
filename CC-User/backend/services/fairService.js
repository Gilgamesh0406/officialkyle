const UsersSeedServer = require('../models/UsersSeedServer');
const UsersSeedClient = require('../models/UsersSeedClient');

const { verifyRecaptcha } = require('./recaptchaService');

const { generateHexCode } = require('../utils/fair');
const { time } = require('../utils/helpers');


const regenerateServerSeed = async (userid, recaptchaToken, socket) => {
    const verified = await verifyRecaptcha(recaptchaToken);

    if(!verified) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid recaptcha!'
        });
    } else {
        await UsersSeedServer.update({ removed: 1 }, {
            where: { userid, removed: 0 }
        });
    
        const serverSeed = generateHexCode(64);
    
        await UsersSeedServer.create({
            userid,
            seed: serverSeed,
            time: time()
        });
    
        socket.emit('message', {
            type: "refresh"
        });
    
        socket.emit('message', {
            type: 'success', success: 'Server seed successfully regenerated!'
        });
    }

}

const changeClientSeed = async (userid, seed, recaptchaToken) => {
    const verified = await verifyRecaptcha(recaptchaToken);
    if(!verified) {
        throw new Error('Invalid recaptcha!');
    }

    await UsersSeedClient.update({ removed: 1 }, {
        where: { userid, removed: 0 }
    });

    await UsersSeedClient.create({
        userid,
        seed,
        time: time()
    });

    return {
        message: 'Client seed successfully changed!',
        type: 'success'
    }
}

module.exports = {
    regenerateServerSeed,
    changeClientSeed
}