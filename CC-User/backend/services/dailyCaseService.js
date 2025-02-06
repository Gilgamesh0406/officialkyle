const { Op, Sequelize } = require('sequelize');
const DailyCases = require('../models/DailyCases');
const DailyCaseBets = require('../models/DailyCaseBets');
const UsersSeedServer = require('../models/UsersSeedServer');

const {
    getUserSeeds,
    generateSaltHash,
    getRoll,
    getCombinedSeed
} = require('../utils/fair');

const {
    calculateLevel,
    getFormatAmount,
    countDecimals,
    getColorByQuality,
    time
} = require('../utils/helpers');

const { getItemDetails, getItems, addUserItem } = require('./itemService');
const config = require('../config');

const dailyCases = {};

const loadCases = async () => {
    console.log('[ITEMS SYSTEM] Loading daily Cases');

    const cases = await DailyCases.findAll({where: { removed: 0 }});

    cases.forEach(caseItem => {
        const items = JSON.parse(caseItem.items);
        dailyCases[caseItem.caseid] = {
            name: caseItem.name,
            image: caseItem.image,
            items,
            level: caseItem.level
        };
    });

    console.log('[ITEMS SYSTEM] Daily Cases Loaded Successfully!');
}

const getCases = async (userId) => {
    const caseList = await Promise.all(Object.keys(dailyCases).map(async (caseId) => {
        const caseItem = dailyCases[caseId];
        const cooldown = await getCaseCooldown(userId, caseId);
        return {
            id: caseId,
            name: caseItem.name,
            image: caseItem.image,
            level: caseItem.level,
            time: cooldown
        }
    }));

    return caseList.sort((a, b) => a.level = b.level);
}

const getCaseCooldown = async (userid, caseid) => {
    const bet = await DailyCaseBets.findOne({
        where: {
            userid,
            caseid,
            time: { [Op.gt]: time() - config.rewards.dailycases.time * 60 * 60 }
        },
        raw: true
    });

    return bet ? (bet.time - time() + config.rewards.dailycases.time * 60 * 60) : -1;
}

const getCaseDetails = async (socket, caseId) => {
    const caseItem = dailyCases[caseId];

    if (!caseItem) {
        socket.emit('message', {
			type: 'error',
			error: 'Error: Invalid case id!'
		});
    }

    // const itemsIds = JSON.parse(caseItem.items);

    const itemsIds = caseItem.items;
    const items = await Promise.all(itemsIds.map(async item => ({
        ...getItemDetails(item.id),
        chance: item.chance
    })));

    return { ...caseItem, items };
}

const openCase = async (socket, user, caseid) => {
    const userLevel = calculateLevel(user.xp).level;

    const caseDetails = await getCaseDetails(socket, caseid);

    if(userLevel < caseDetails.level) {
        socket.emit('message', {
			type: 'error',
			error: 'Error: You need to level up to open this case!'
		});
    }

    const cooldown = await getCaseCooldown(user.userid, caseid);

    if(cooldown > 0) {
        return -1;
    }

    const fairData = await getUserSeeds(user.userid);
    const seed = getCombinedSeed(fairData.serverSeed, fairData.clientSeed, fairData.nonce);
    const salt = generateSaltHash(seed);

    const items = getItems(dailyCases[caseid].items);

    const tickets = generateTickets(items);
    const total = tickets[tickets.length - 1].max;

    const roll = getRoll(salt, total) + 1;
    const winningItem = determineWinningItem(tickets, roll, caseDetails.items);

    await recordBet(user, caseid, winningItem, roll, total, fairData);
    await incrementNonce(fairData.serverSeedId, user.userid);
    await addUserItem(user.userid, [ winningItem.id ], 'dailycase_win');

    return winningItem;
};

const generateTickets = (items) => {
    let decimals = 0;

    items.forEach(item => {
        if(countDecimals(item.chance) > decimals)
            decimals = countDecimals(item.chance);
    });

    let total = 0;
    return items.map(item => {
        const min = total + 1;
        const max = total +  item.chance * Math.pow(10, decimals);
        total = max;
        return { min, max }
    })
}

const generateSpinner = (items) => {
    const tickets = generateTickets(items);
    const total = tickets[tickets.length - 1].max;

    let spinner = [];

    for(let i = 0; i < 150; i++) {
        const ticket = Math.floor(Math.random() * total) + 1;
        const item = items.find((_, j) => ticket >= tickets[j].min && ticket <= tickets[j].max);

        spinner.push({
            name: item.name,
            image: item.image,
            price: getFormatAmount(item.price),
            chance: item.chance,
            color: getColorByQuality(item.quality)
        });
    }
    return spinner;
}

const determineWinningItem = (tickets, roll, items) => {
    for(let i = 0; i < tickets.length; i++) {
        if(roll >= tickets[i].min && roll <= tickets[i].max) {
            return items[i];
        }
    }
    return null;
}

const recordBet = async (user, caseId, winningItem, roll, total, fairData) => {
    await DailyCaseBets.create({
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
        nonce: fairData.nonce,
        time: time()
    });
}

const incrementNonce = async (serverSeedId, userid) => {
    await UsersSeedServer.update(
        { nonce: Sequelize.literal('nonce + 1') },
        { where: { id: serverSeedId, userid } }
    );
}

module.exports = {
    dailyCases,
    loadCases,
    getCases,
    getCaseDetails,
    openCase,
    generateSpinner
};