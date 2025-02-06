const axios = require('axios');
const crypto = require('crypto');
const UsersSeedClient = require('../models/UsersSeedClient');
const UsersSeedServer = require('../models/UsersSeedServer');

const { isJsonString } = require('./helpers');
const config = require('../config');

let generateQueue = [];
let haveGenerateQueue = false;
let getQueue = [];
let haveGetQueue = false;

const generateHexCode = (length) => {
    let text = '';
    let possible = 'abcdef0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
}

const generateServerSeed = () => {
    // return crypto.randomBytes(32).toString('hex');
    return generateHexCode(64);
}

const getCombinedSeed = (serverSeed, clientSeed, nonce) => {
    // return sha256(`${serverSeed}:${clientSeed}:${nonce}`);
    return [serverSeed, clientSeed, nonce].join('-');
}

const generateEosSeed = (initialize, callback) => {
    generateQueue.push({initialize, callback});

    if(!haveGenerateQueue)
        queueGenerateEosSeed();
}

const queueGenerateEosSeed = () => {
    haveGenerateQueue = true;

    axios.get(config.games.eos_getChainInfo_url)
        .then(response => {
            if(response.status !== 200) {
                setTimeout(queueGenerateEosSeed, 1000);
                return;
            }

            const data = response.data;
            const last_block = data.head_block_num;
            const target_block = last_block + config.games.eos_future;

            generateQueue[0].initialize({ block: target_block });

            const callback = generateQueue[0].callback;

            getEosSeed(target_block, (target_hash) => {
                callback({
                    block: target_block,
                    hash: target_hash
                });
            });

            generateQueue.shift();

            setTimeout(() => {
                if (generateQueue.length > 0)
                    return queueGenerateEosSeed();

                haveGenerateQueue = false;
            }, 1000);
        })
        .catch((err) => {
            setTimeout(queueGenerateEosSeed, 1000);
            console.log("[EOS] Seed generation error", err)
        });
}

const getEosSeed = (block, callback) => {
    getQueue.push({ block, callback });

    if (!haveGetQueue) {
        queueGetEosSeed();
    }
}

const queueGetEosSeed = () => {
    haveGetQueue = true;

    axios.post(config.games.eos_getBlock_url, {
        block_num_or_id: getQueue[0].block
    })
    .then(response => {
        if (response.status !== 200 || !response.data) {
            setTimeout(queueGetEosSeed, 1000);
            return;
        }

        const data = response.data;
        const hash = data.id;

        getQueue[0].callback(hash);
        getQueue.shift();

        setTimeout(() => {
            if (getQueue.length > 0) {
                return queueGetEosSeed();
            }
            haveGetQueue = false;
        }, 1000);
    })
    .catch((error) => {
        setTimeout(queueGetEosSeed, 1000);
    });
}

const getUserSeeds = async (userid) => {
    const clientSeed = await UsersSeedClient.findOne({
        where: { userid, removed: 0 }
    });

    const serverSeed = await UsersSeedServer.findOne({
        where: { userid, removed: 0 }
    });

    if(!clientSeed ||!serverSeed) {
        new Error('Unable to get the user seeds');
        return;
    }

    return {
        clientSeedId: clientSeed.id,
        serverSeedId: serverSeed.id,
        clientSeed: clientSeed.seed,
        serverSeed: serverSeed.seed,
        nonce: serverSeed.nonce
    }
}

const getRollPlinko = (salt) => {
    const result = [];
    for(let i = 0; i < 14; i++) {
        const saltHash = generateSaltHash(salt + '-' + i);
        const roll = getRoll(saltHash, 2);
        result.push(roll);
    }
    return result;
}

const getRollCaseBattle = (salt, rounds, players) => {
    let array = [];
	
	for(let i = 0; i < rounds; i++) {
		array.push([]);

		for(let j = 0; j < players; j++) {
			let saltPosition = generateSaltHash(salt + '-' + i + '-' + j);
			let roll = getRoll(saltPosition, Math.pow(10, 8)) / Math.pow(10, 8);

			array[i].push(roll);
		}
	}

	return array;
}
const generateSaltHash = (seed) => {
    return crypto.createHmac('sha256', seed).digest('hex');
}

const getRoll = (salt, max) => {
    return Math.abs(parseInt(salt.substr(0, 12), 16)) % max;
}

module.exports = {
    generateServerSeed,
    getCombinedSeed,
    generateEosSeed,
    generateSaltHash,
    getRoll,
    getRollPlinko,
    getRollCaseBattle,
    getUserSeeds,
    generateHexCode
}