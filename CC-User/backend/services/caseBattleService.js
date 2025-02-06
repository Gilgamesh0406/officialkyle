const sha256 = require('sha256');
const { Op } = require('sequelize');

const Cases = require('../models/Cases');

const { CasebattleBets, CasebattleGames } = require('../models');
const CasebattleItems = require('../models/CasebattleItems');
const CasebattleWinnings = require('../models/CasebattleWinnings');
const CasebattleRolls = require('../models/CasebattleRolls');
const CasebattleDraws = require('../models/CasebattleDraws');

const { getItemDetails, getItems } = require('./itemService');
const { sellAllGameItems } = require('./inventoryService');

const {
    registerBet,
    updateBalance,
    updateLevel,
    editBalance,
    refundBet,
    finishBet
} = require('./bettingService');

const {
    getFormatAmount,
    calculateLevel,
    time,
    getColorByQuality,
    getFormatAmountString,
    countDecimals,
    getRandomInt,
    roundedToFixed,
    getFeeFromCommission
} = require('../utils/helpers');

const { generateHexCode, getRollCaseBattle } = require('../utils/fair');

const {
    getCombinedSeed,
    generateSaltHash,
    getRoll,
    generateEosSeed,
    generateServerSeed
} = require('../utils/fair');

const config = require('../config');

let caseBattleStats = {
    active: 0,
    total: 0
};

let caseBattleGames = {};
let caseBattleCases = {};
let caseBattleSecure = {};

const loadStats = async () => {
    try {
        const totalGames = await CasebattleGames.count({
            where: { canceled: 0 }
        });

        const activeGames = await CasebattleGames.count({
            where: {
                ended: 0,
                canceled: 0
            }
        });

        caseBattleStats = {
            active: activeGames,
            total: totalGames
        };
        console.log('[CASE BATTLE] Loaded case battle stats');
    } catch(error) {
        console.error('[CASE BATTLE] Error loading case battle stats');
    }
}

const loadGameCases = async () => {
    console.log('[UNBOXING] Loading Cases');

    const cases = await Cases.findAll({
        where: { removed: 0 }
    });

    cases.forEach(caseItem => {
        const items = JSON.parse(caseItem.items);
        const offset = roundedToFixed(caseItem.offset, 2);
        const battle = parseInt(caseItem.battle);

        if(battle) {
            let price = 0;

            items.forEach(item => {
                price += getFormatAmount(getItemDetails(item.id).price) * item.chance / 100;
            });
    
            price = getFormatAmount(price * (1 + offset / 100));
    
            caseBattleCases[caseItem.caseid] = {
                name: caseItem.name,
                image: caseItem.image,
                price,
                category: 0,
                items,
            };
        }
    });

    console.log('[CASE BATTLE] Cases Loaded Successfully!');
}
const loadHistory = async (io) => {
    try {
        const games = await CasebattleGames.findAll({
            where: { ended: 0, canceled: 0 }
        });

        if(games.length == 0)
            return;

        for(const game of games) {
            const cases = JSON.parse(game.cases).map(caseId => ({
                id: caseId,
                name: caseBattleCases[caseId].name,
                image: caseBattleCases[caseId].image,
                price: getFormatAmount(caseBattleCases[caseId].price),
            }));

            const gameData = {
                id: game.id,
                battleid: game.battleid,
                status: 0,
                players: [],
                mode: game.mode,
                privacy: game.privacy,
                free: game.free,
                crazy: game.crazy,
                cases,
                amount: getFormatAmount(game.amount),
                round: 0,
                game: {
                    server_seed: game.server_seed,
                    public_seed: null,
                    block: null
                },
                draw: {
                    public_seed: null,
                    block: null
                },
                time: game.time
            };

            const totalPlayers = [2, 3, 4, 5][game.mode];
            caseBattleSecure[game.battleid] = {};
            
            for(let i = 0; i < totalPlayers; i++)
                caseBattleSecure[game.battleid][i] = {};

            const bets = await CasebattleBets.findAll({
                where: {
                    gameid: game.id,
                    canceled: 0
                }
            });

            if(bets.length >= totalPlayers) {
                gameData.status = 1;
                gameData.time = time();
            }

            for(const bet of bets) {
                gameData.players.push({
                    user: {
                        userid: bet.userid,
                        name: bet.name,
                        avatar: bet.avatar,
                        level: calculateLevel(bet.xp).level
                    },
                    position: bet.position,
                    creator: bet.creator,
                    bot: bet.bot,
                    items: [],
                    total: 0
                });
            }

            // if(gameData.status) {
            //     continueGame(game.battleid, io);
            // }

            caseBattleGames[game.battleid] = gameData;
        }

        console.log('[CASE BATTLE] History Loaded');
    } catch(error) {
        console.log('[CASE BATTLE] Error loading case battle history : ', error);
    }
}

const gameShow = async (user, socket, id) => {
    try {
        const game = await CasebattleGames.findOne({
            where: { battleid: id, canceled: 0 }
        });

        if(!game) {
            socket.emit('message', {
                type: 'error',
                error: 'Error: Invalid battle id!'
            });
        }

        if(caseBattleGames[id] && game.ended == 0) {
            const gameData = {
                privacy: caseBattleGames[id].privacy,
                free: caseBattleGames[id].free,
                crazy: caseBattleGames[id].crazy,
                round: caseBattleGames[id].round,
            }

            gameData.game = {
                server_seed_hashed: sha256(caseBattleGames[id].game.server_seed),
                nonce: caseBattleGames[id].id,
            }

            gameData.draw = null;

            if(caseBattleGames[id].status == 2) {
                gameData.game.block = caseBattleGames[id].game.block;
            } else if(caseBattleGames[id].status == 3) {
                gameData.countdown = config.games.games.casebattle.timer_countdown;
                gameData.game.block = caseBattleGames[id].game.block;
            } else if(caseBattleGames[id].status == 4 || caseBattleGames[id].status == 5) {
                gameData.round = caseBattleGames[id].round;
                gameData.positions = getWinners(caseBattleGames[id].players, caseBattleGames[id].mode, caseBattleGames[id].crazy)
                                        .reduce((acc, obj) => { return [ ...acc, ...obj.winners ] }, []);
                gameData.game.block = caseBattleGames[id].game.block;
            } else if(caseBattleGames[id].status == 6) {
                const winnersPositions = getWinners(caseBattleGames[id].players, caseBattleGames[id].mode, caseBattleGames[id].crazy);
                const seed = getCombinedSeed(caseBattleGames[id].game.server_seed, caseBattleGames[id].draw.public_seed, caseBattleGames[id].id);

                const salt = generateSaltHash(seed);
                const roll = getRoll(salt, winnersPositions.length);

                gameData.winners = winnersPositions.filter(a => a.position == roll)[0].winners;
                gameData.game.server_seed = caseBattleGames[id].game.server_seed;
                gameData.game.block = caseBattleGames[id].game.block;
            }

            if(caseBattleGames[id].draw) {
                if(caseBattleGames[id].status == 5) {
                    gameData.draw = {
                        block: caseBattleGames[id].draw.block,
                    }
                } else if(caseBattleGames[id].status == 6) {
                    gameData.draw = caseBattleGames[id].draw;
                }
            }

            socket.emit('message', {
                type: 'casebattle',
                command: 'show',
                status: caseBattleGames[id].status,
                casebattle: {
                    id: id,
                    players: caseBattleGames[id].players,
                    mode: caseBattleGames[id].mode,
                    cases: caseBattleGames[id].cases,
                    amount: caseBattleGames[id].amount,
                    data: gameData
                }
            });

        } else {
            const amount = getFormatAmount(game.amount);

            const cases = JSON.parse(game.cases).map(item => {
                const caseData = caseBattleCases[item];

                return {
                    id: item,
                    name: caseData.name,
                    image: caseData.image,
                    price: getFormatAmount(caseData.price)
                }
            });

            const bets = await CasebattleBets.findAll({
                where: { gameid: game.id, canceled: 0 }
            });

            const players = bets.map(bet => ({
                user: {
                    userid: bet.userid,
                    name: bet.name,
                    avatar: bet.avatar,
                    level: calculateLevel(bet.xp).level
                },
                position: bet.position,
                creator: bet.creator,
                bot: bet.bot,
                items: [],
                total: 0
            }));

            const items = await CasebattleItems.findOne({
                where: { gameid: game.id }
            });

            JSON.parse(items.items).forEach(item => {
                const playerIndex = players.findIndex(player => player.position == item.position);

                players[playerIndex].items.push({
                    name: getItemDetails(item.itemid).name,
                    image: getItemDetails(item.itemid).image,
                    price: getFormatAmount(getItemDetails(item.itemid).price),
                    color: getColorByQuality(getItemDetails(item.itemid).quality)
                });

                players[playerIndex].total = getFormatAmount(players[playerIndex].total + getFormatAmount(getItemDetails(item.itemid).price));
            });

            const winnings = await CasebattleWinnings.findAll({
                where: { gameid: game.id },
                attributes: ['position']
            });

            const rolls = await CasebattleRolls.findOne({
                where: { gameid: game.id }
            });

            const draws = await CasebattleDraws.findAll({
                where: { gameid: game.id }
            });

            const draw = draws ? {
                public_seed: draws.public_seed,
                block: draws.blockid
            } : null;

            socket.emit('message', {
                type: 'casebattle',
                command: 'show',
                status: 6,
                casebattle: {
                    id: id,
                    players: players,
                    mode: game.mode,
                    cases: cases,
                    amount: amount,
                    data: {
                        game: {
                            server_seed_hashed: sha256(game.server_seed),
                            server_seed: game.server_seed,
                            public_seed: rolls.public_seed,
                            block: rolls.blockid,
                            nonce: game.id
                        },
                        draw: draw,
                        round: cases.length - 1,
                        privacy: game.privacy,
                        free: game.free,
                        crazy: game.crazy,
                        winners: winnings.map(item => parseInt(item.position))
                    }
                }
            });
        }
    } catch(error) {
        console.error('Error in case ball game show : ', error);
        socket.emit('message', {
            type: 'error',
            error: 'Error: ' + error.message
        })
    }
}

const getFinishedBattles = async (user, socket, io) => {
    try {
        const finishedGames = await CasebattleGames.findAll({
            where: { ended: 1 },
            order: [['id', 'DESC']],
            limit: 20
        });

        const battles = await caseBattleList(finishedGames);

        socket.emit('message', {
            type: 'casebattle',
            command: 'list',
            battles: battles
        });

    } catch(error) {
        console.error('Error in getFinishedBattles:', error);
        socket.emit('message', {
            type: 'error',
            error: 'Error: ' + error.message
        });
    }
}

const getMyBattles = async (user, socket, io) => {
    try {
        if(!user) {
            socket.emit('message', {
                type: 'casebattle',
                command: 'list',
                battles: []
            });
            return;
        }
        const finishedGames = await CasebattleGames.findAll({
            include: [{
                model: CasebattleBets,
                where: {
                    userid: user.userid,
                    canceled: 0
                }
            }],
            where: { ended: 1 },
            order: [['id', 'DESC']],
            limit: 20
        });

        const battles = await caseBattleList(finishedGames);

        const myActiveGames = Object.values(caseBattleGames).filter(game =>
            game.status != 5 &&
            game.players.some(player => player.user.userid == user.userid)
        );

        const myActiveBattles = myActiveGames.map(game => ({
            status: game.status,
            casebattle: {
                id: game.battleid,
                players: game.players,
                mode: game.mode,
                cases: game.cases,
                amount: game.amount,
                free: game.free,
                crazy: game.crazy,
                time: parseInt(game.time),
                data: {}
            }
        }));

        socket.emit('message', {
            type: 'casebattle',
            command: 'list',
            battles: [...battles, ...myActiveBattles]
            // battles: [...battles]
        });

    } catch(error) {
        console.error('Error in getMyBattles:', error);
        socket.emit('message', {
            type: 'error',
            error: 'Error: ' + error.message
        });
    }
}
const caseBattleList = async (games) => {
    try {
        const battles = [];

        for (const game of games) {
            const cases = JSON.parse(game.cases).map(caseId => {
                if(caseBattleCases[caseId] !== undefined) {
                    return ({
                        id: caseId,
                        name: caseBattleCases[caseId].name,
                        image: caseBattleCases[caseId].image,
                        price: getFormatAmount(caseBattleCases[caseId].price)
                    })
                }
            });

            const battle = {
                status: 6,
                casebattle: {
                    id: game.battleid,
                    players: [],
                    mode: game.mode,
                    cases: cases,
                    amount: getFormatAmount(game.amount),
                    free: game.free,
                    crazy: game.crazy,
                    time: parseInt(game.time),
                    data: {}
                },
            };

            const bets = await CasebattleBets.findAll({
                where: { gameid: game.id, canceled: 0 }
            });

            for (const bet of bets) {
                battle.casebattle.players.push({
                    user: {
                        userid: bet.userid,
                        name: bet.name,
                        avatar: bet.avatar,
                        level: calculateLevel(bet.xp).level
                    },
                    position: bet.position,
                    creator: bet.creator,
                    bot: bet.bot,
                    items: [],
                    total: 0
                });
            }

            const winnings = await CasebattleWinnings.findAll({
                where: { gameid: game.id }
            });

            battle.casebattle.data.winners = winnings.map(win => win.position);

            battles.push(battle);
        }

        return battles;
    } catch(error) {
        console.error('Error in caseBattleList:', error);
        throw new Error('Error fetching case battle list.');
    }
}

const loadCases = async (socket) => {
    try{
        const listCases = Object.keys(caseBattleCases).map(id => ({
            id: id,
            name: caseBattleCases[id].name,
            image: caseBattleCases[id].image,
            price: getFormatAmount(caseBattleCases[id].price)
        }));

        listCases.sort((a, b) => a.price - b.price);

        socket.emit('message', {
            type: 'casebattle',
            command: 'cases',
            cases: listCases
        });

    } catch(error) {
        console.error('Error in loadCases:', error);
        socket.emit('message', {
            type: 'error',
            error: 'Error: ' + error.message
        });
    }
}

const cerateCaseBattle = async (user, socket, cases, mode, privacy, free, crazy, io) => {
 try {
    if (!Array.isArray(cases)) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid cases!'
        });
        return;
    }

    if (isNaN(Number(mode))) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid mode!'
        });
        return;
    }

    if (![0, 1, 2, 3].includes(parseInt(mode))) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid mode [1v1, 1v1v1, 1v1v1v1 or 2v2]!'
        });
        return;
    }

    if (isNaN(Number(privacy))) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid privacy!'
        });
        return;
    }

    if (![0, 1].includes(parseInt(privacy))) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid privacy [public or private]!'
        });
        return;
    }

    if (isNaN(Number(free))) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid free!'
        });
    }

    if (![0, 1].includes(parseInt(free))) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid free!'
        });
        return;
    }

    if (isNaN(Number(crazy))) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid crazy!'
        });
        return;
    }

    if (![0, 1].includes(parseInt(crazy))) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid crazy!'
        });
        return;
    }

    mode = parseInt(mode);
    privacy = parseInt(privacy);
    free = parseInt(free);
    crazy = parseInt(crazy);

    if (cases.length < config.games.games.casebattle.interval_cases.min) {
        socket.emit('message', {
            type: 'error',
            error: `You have to select minimum ${config.games.games.casebattle.interval_cases.min} cases!`
        });
        return;
    }

    if (cases.length > config.games.games.casebattle.interval_cases.max) {
        socket.emit('message', {
            type: 'error',
            error: `You have to select maximum ${config.games.games.casebattle.interval_cases.max} cases!`
        });
        return;
    }

    const currentGames = await CasebattleGames.findAll({
        include: [{
            model: CasebattleBets,
            where: {
                userid: user?.userid ,
                canceled: 0,
                creator: 1
            }
        }],
        where: { ended: 0 },
        order: [['id', 'DESC']]
    });

    if (currentGames.length >= config.games.games.casebattle.max_game_count) {
        socket.emit('message', {
            type: 'error',
            error: `You reached the limit of games you can create !`
        });
        return;
    }

    let amount = 0;
    let available = true;

    for (let i = 0; i < cases.length; i++) {
        if (!Object.keys(caseBattleCases).includes(cases[i])) {
            available = false;
            break;
        }
        amount += getFormatAmount(caseBattleCases[cases[i]].price);
    }

    if (!available) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid cases in your battle!'
        });
        return;
    }

    const totalPlayers = [2, 3, 4, 4][mode];
    let casebattleAmount = getFormatAmount(amount);

    if (free) amount = getFormatAmount(amount * totalPlayers);

    await registerBet(user.userid, amount, [], 'casebattle', false, io, async (err) => {
        if(err) {
            socket.emit('message', {
                type: 'error',
                error: err.message
            });
        } else {
            const serverSeed = generateServerSeed();
            const id = generateHexCode(24);

            const newGame = await CasebattleGames.create({
                cases: JSON.stringify(cases),
                amount: casebattleAmount,
                mode,
                privacy,
                free,
                crazy,
                server_seed: serverSeed,
                battleid: id,
                time: time()
            });

            await CasebattleBets.create({
                userid: user.userid,
                name: user.name,
                avatar: user.avatar,
                xp: parseInt(user.xp),
                bot: parseInt(user.bot),
                gameid: newGame.id,
                position: 0,
                creator: 1,
                time: time()
            });

            const list = cases.map(item => ({
                id: item,
                name: caseBattleCases[item].name,
                image: caseBattleCases[item].image,
                price: getFormatAmount(caseBattleCases[item].price)
            }));

            caseBattleGames[id] = {
                id: newGame.id,
                battleid: id,
                status: 0,
                players: [],
                mode,
                privacy,
                free,
                crazy,
                cases: list,
                amount: casebattleAmount,
                round: 0,
                game: {
                    server_seed: serverSeed,
                    public_seed: null,
                    block: null
                },
                draw: {
                    public_seed: null,
                    block: null
                },
                time: time()
            };

            caseBattleSecure[id] = Array.from({ length: totalPlayers }, () => ({}));

            caseBattleGames[id].players.push({
                user: {
                    userid: user.userid,
                    name: user.name,
                    avatar: user.avatar,
                    level: calculateLevel(user.xp).level
                },
                position: 0,
                creator: 1,
                bot: user.bot,
                items: [],
                total: 0
            });

            socket.emit('message', {
                type: 'casebattle',
                command: 'bet_confirmed'
            });

            socket.emit('message', {
                type: 'casebattle',
                command: 'redirect',
                action: 'join',
                id: id
            });

            if (!privacy) {
                io.sockets.in('casebattle').emit('message', {
                    type: 'casebattle',
                    command: 'add',
                    casebattle: {
                        id: id,
                        players: caseBattleGames[id].players,
                        mode,
                        cases: list,
                        amount: casebattleAmount,
                        free,
                        time: caseBattleGames[id].time,
                        data: {}
                    }
                });
            }

            caseBattleStats.active++;
            caseBattleStats.total++;

            io.sockets.in('casebattle').emit('message', {
                type: 'casebattle',
                command: 'stats',
                stats: caseBattleStats
            });

            await updateBalance(user.userid, io);

            console.log(`[CASE BATTLE] Bet registered. ${user.name} did bet $${getFormatAmountString(amount)}`);
        }
    });
 } catch(error) {
    console.error('Error in createCaseBattle:', error);
    socket.emit('message', {
        type: 'error',
        error: `Error: ${error.message}`
    });
 }
}

const joinCaseBattle = async (user, socket, id, position, io) => {
    try {
        if (isNaN(Number(position))) {
            socket.emit('message', {
                type: 'error',
                error: 'Invalid position!'
            });
            return;
        }

        position = parseInt(position);

        if (!caseBattleGames[id]) {
            socket.emit('message', {
                type: 'error',
                error: 'Invalid case battle id!'
            });
            return;
        }

        if (caseBattleGames[id].status != 0) {
            socket.emit('message', {
                type: 'error',
                error: 'This case battle has already ended!'
            });
            return;
        }

        const totalPlayers = [2, 3, 4, 4][caseBattleGames[id].mode];

        if (position < 0 || position >= totalPlayers) {
            socket.emit('message', {
                type: 'error',
                error: 'That position is invalid!'
            });
            return;
        }

        if (caseBattleGames[id].players.some(a => a.position == position)) {
            socket.emit('message', {
                type: 'error',
                error: 'That position is already taken!'
            });
            return;
        }

        if (caseBattleGames[id].players.some(a => a.user.userid == user.userid)) {
            socket.emit('message', {
                type: 'error',
                error: 'You already joined this case battle!'
            });
            return;
        }

        if (Object.keys(caseBattleSecure[id][position]).length > 0) {
            socket.emit('message', {
                type: 'error',
                error: 'Another user is trying to join this game. Please try again later!'
            });
            return;
        }

        await caseBattleJoinConfirm(user, id, position, socket, io).then(async (err) => {
            if(err !== undefined) {
                caseBattleSecure[id][position][user.userid] = true;

                socket.emit('message', {
                    type: 'casebattle',
                    command: 'bet_confirmed'
                });

                for (let i = 0; i < totalPlayers; i++) {
                    if (caseBattleGames[id].players.filter(a => a.position == i).length <= 0) {
                        socket.emit('message', {
                            type: 'casebattle',
                            command: 'update',
                            stage: 'position',
                            status: caseBattleGames[id].status,
                            position: i,
                            casebattle: {
                                id: id,
                                players: caseBattleGames[id].players,
                                mode: caseBattleGames[id].mode,
                                cases: caseBattleGames[id].cases,
                                amount: caseBattleGames[id].amount,
                                data: {}
                            }
                        });
                    }
                }

                await updateBalance(user.userid, io);
            }
        });
    } catch(error) {
        console.error('Error in joinCaseBattle:', error);
        socket.emit('message', {
            type: 'error',
            error: `Error: ${error.message}`
        });
    }
}

const leaveCaseBattle = async (user, socket, id, position, io) => {
    try {
        if (isNaN(Number(position))) {
            socket.emit('message', {
                type: 'error',
                error: 'Invalid position!'
            });
            return;
        }

        position = parseInt(position);

        if (!caseBattleGames[id]) {
            socket.emit('message', {
                type: 'error',
                error: 'Invalid case battle id!'
            });
            return;
        }

        if (caseBattleGames[id].status != 0) {
            socket.emit('message', {
                type: 'error',
                error: 'This case battle has already ended!'
            });
            return;
        }

        const totalPlayers = [2, 3, 4, 4][caseBattleGames[id].mode];

        if (position < 0 || position >= totalPlayers) {
            socket.emit('message', {
                type: 'error',
                error: 'That position is invalid!'
            });
            return;
        }
        if (caseBattleGames[id].players.filter(a => a.position == position).length <= 0) {
            socket.emit('message', {
                type: 'error',
                error: 'That position is not taken!'
            });
            return;
        }

        if (caseBattleGames[id].players.find(a => a.position == position).user.userid != user.userid) {
            socket.emit('message', {
                type: 'error',
                error: 'That position is not yours!'
            });
            return;
        }

        const removePosition = caseBattleGames[id].players.findIndex(a => a.position == position);

        if (caseBattleGames[id].players[removePosition].creator && caseBattleGames[id].players.length > 1 && caseBattleGames[id].free) {
            socket.emit('message', {
                type: 'error',
                error: 'The creator can\'t leave a free case battle once other players already joined!'
            });
            return;
        }

        let amount = getFormatAmount(caseBattleGames[id].amount);

        if (caseBattleGames[id].free) {
            if (caseBattleGames[id].players[removePosition].creator) {
                amount = getFormatAmount(amount * totalPlayers);
            } else {
                amount = 0;
            }
        }

        await refundBet(user.userid, amount, 'casebattle', async (err) => {
            if (err) {
                console.error('Error in refundBet:', err);
                socket.emit('message', {
                    type: 'error',
                    error: `Error: ${err.message}`
                });
                return;
            }

            await CasebattleBets.update(
                { canceled: 1 },
                {
                    where: {
                        gameid: caseBattleGames[id].id,
                        position: position
                    }
                }
            );

            const remainingBets = await CasebattleBets.count({
                where: {
                    gameid: caseBattleGames[id].id,
                    canceled: 0
                }
            });

            if (remainingBets <= 0) {
                await CasebattleGames.update(
                    { canceled: 1 },
                    { where: { id: caseBattleGames[id].id } }
                );

                io.sockets.in('casebattle').emit('message', {
                    type: 'casebattle',
                    command: 'redirect',
                    action: 'leave',
                    id: id
                });

                if (!caseBattleGames[id].privacy) {
                    io.sockets.in('casebattle').emit('message', {
                        type: 'casebattle',
                        command: 'remove',
                        casebattle: {
                            id: id
                        }
                    });
                }

                caseBattleStats.active--;

                io.sockets.in('casebattle').emit('message', {
                    type: 'casebattle',
                    command: 'stats',
                    stats: caseBattleStats
                });

                delete caseBattleGames[id];

                await updateBalance(user.userid, io);

                console.log(`[CASE BATTLE] Leave Registered. Bet #${id} was canceled`);
            } else {
                caseBattleGames[id].players.splice(removePosition, 1);

                if (!caseBattleGames[id].privacy) {
                    io.sockets.in('casebattle').emit('message', {
                        type: 'casebattle',
                        command: 'edit',
                        status: caseBattleGames[id].status,
                        casebattle: {
                            id: id,
                            players: caseBattleGames[id].players,
                            mode: caseBattleGames[id].mode,
                            cases: caseBattleGames[id].cases,
                            amount: caseBattleGames[id].amount,
                            free: caseBattleGames[id].free,
                            time: caseBattleGames[id].time,
                            data: {}
                        }
                    });
                }

                for (let i = 0; i < totalPlayers; i++) {
                    if (caseBattleGames[id].players.filter(a => a.position == i).length <= 0) {
                        io.sockets.in('casebattle').emit('message', {
                            type: 'casebattle',
                            command: 'update',
                            stage: 'position',
                            status: caseBattleGames[id].status,
                            position: i,
                            casebattle: {
                                id: id,
                                players: caseBattleGames[id].players,
                                mode: caseBattleGames[id].mode,
                                cases: caseBattleGames[id].cases,
                                amount: caseBattleGames[id].amount,
                                data: {}
                            }
                        });
                    }
                }

                await updateBalance(user.userid, io);

                console.log(`[CASE BATTLE] Leave Registered. Bet #${id} was updated`);
            }
        });
    } catch(error) {
        console.error('Error in leaveCaseBattle:', error);
        socket.emit('message', {
            type: 'error',
            error: `Error: ${error.message}`
        });
    }
}

const caseBattleJoinConfirm = async (user, id, position, socket, io) => {
    try {
        const amount = getFormatAmount(caseBattleGames[id].amount);

        if(caseBattleGames[id]['free'])
            amount = 0;

        const totalPlayers = [2, 3, 4, 4][caseBattleGames[id].mode];

        await registerBet(user.userid, amount, [], 'casebattle', false, io, async (err) => {
            if(err) {
                socket.emit('message', {
                    type: 'error',
                    error: err.message
                });
                return err;
            } else {
                const existingBet = await CasebattleBets.findOne({
                    where: {
                        userid: user.userid,
                        gameid: caseBattleGames[id].id,
                        canceled: 1,
                        creator: 1
                    }
                });

                const creator = existingBet? 1 : 0;

                await CasebattleBets.create({
                    userid: user.userid,
                    name: user.name,
                    avatar: user.avatar,
                    xp: parseInt(user.xp),
                    bot: parseInt(user.bot),
                    gameid: caseBattleGames[id].id,
                    position: position,
                    creator: parseInt(creator),
                    time: time()
                });

                caseBattleGames[id]['players'].push({
                    user: {
                        userid: user.userid,
                        name: user.name,
                        avatar: user.avatar,
                        level: calculateLevel(user.xp).level
                    },
                    position: position,
                    bot: user.bot,
                    creator: creator,
                    items: [],
                    total: 0
                });

                if(caseBattleGames[id]['players'].length >= totalPlayers) {
                    caseBattleGames[id].status = 1;
                }

                if(!caseBattleGames[id].privacy) {
                    io.sockets.in('casebattle').emit('message', {
                        type: 'casebattle',
                        command: 'edit',
                        status: caseBattleGames[id].status,
                        casebattle: {
                            id: id,
                            players: caseBattleGames[id]['players'],
                            mode: caseBattleGames[id]['mode'],
                            cases: caseBattleGames[id]['cases'],
                            amount: caseBattleGames[id]['amount'],
                            free: caseBattleGames[id]['free'],
                            time: caseBattleGames[id]['time'],
                            data: {}
                        }
                    });
                }

                io.sockets.in('casebattle').emit('message', {
                    type: 'casebattle',
                    command: 'update',
                    stage: 'position',
                    status: caseBattleGames[id].status,
                    position: position,
                    casebattle: {
                        id: id,
                        players: caseBattleGames[id]['players'],
                        mode: caseBattleGames[id]['mode'],
                        cases: caseBattleGames[id]['cases'],
                        amount: caseBattleGames[id]['amount'],
                        data: {}
                    }
                });

                if(caseBattleGames[id].status == 1)
                    continueGame(id, io);

                console.log('[CASE BATTLE] Join registered. ' + user.name + ' placed a bet of $' + getFormatAmountString(amount));
            }
        });

    } catch(error) {
        console.error('Error in joinConfirm : ', error);
        socket.emit('message', {
            type: 'error',
            error: 'Error: ' + error.message
        });
    }
}

const continueGame = async (id, io) => {
    delete caseBattleSecure[id];

    const totalPlayers = [2, 3, 4, 4][caseBattleGames[id].mode];

    io.sockets.in('casebattle').emit('message', {
        type: 'casebattle',
        command: 'update',
        stage: 'refresh',
        status: caseBattleGames[id]['status'],
        casebattle: {
            id: id,
            players: caseBattleGames[id]['players'],
            mode: caseBattleGames[id]['mode'],
            cases: caseBattleGames[id]['cases'],
            amount: caseBattleGames[id]['amount'],
            data: {
                game: {
                    server_seed_hashed: sha256(caseBattleGames[id].game.server_seed),
                    nonce: caseBattleGames[id].id
                },
                draw: null
            }
        }
    });

    setTimeout(async () => {
            generateEosSeed((eosData) => {
                caseBattleGames[id].status = 2;
                caseBattleGames[id].game.block = eosData.block;

                io.sockets.in('casebattle').emit('message', {
                    type: 'casebattle',
                    command: 'update',
                    stage: 'refresh',
                    status: caseBattleGames[id]['status'],
                    casebattle: {
                        id: id,
                        players: caseBattleGames[id]['players'],
                        mode: caseBattleGames[id]['mode'],
                        cases: caseBattleGames[id]['cases'],
                        amount: caseBattleGames[id]['amount'],
                        data: {
                            game: {
                                server_seed_hashed: sha256(caseBattleGames[id].game.server_seed),
                                block: caseBattleGames[id].game.block,
                                nonce: caseBattleGames[id].id
                            },
                            draw: null
                        }
                    }
                });

                if(!caseBattleGames[id].privacy) {
                    io.sockets.in('casebattle').emit('message', {
                        type: 'casebattle',
                        command: 'edit',
                        status: caseBattleGames[id].status,
                        casebattle: {
                            id: id,
                            players: caseBattleGames[id]['players'],
                            mode: caseBattleGames[id]['mode'],
                            cases: caseBattleGames[id]['cases'],
                            amount: caseBattleGames[id]['amount'],
                            free: caseBattleGames[id]['free'],
                            time: caseBattleGames[id]['time'],
                            data: {}
                        }
                    })
                }

            }, async (eosData) => {
                await CasebattleRolls.update(
                    { removed: 1 },
                    { where: { gameid: caseBattleGames[id].id } });

                const seed = getCombinedSeed(caseBattleGames[id].game.server_seed, eosData.hash, caseBattleGames[id].id);
                const salt = generateSaltHash(seed);
                const roll = getRollCaseBattle(salt, caseBattleGames[id]['cases'].length, totalPlayers);

                await CasebattleRolls.create({
                    gameid: caseBattleGames[id].id,
                    blockid: eosData.block,
                    public_seed: eosData.hash,
                    roll: JSON.stringify(roll),
                    time: time()
                });

                caseBattleGames[id].status = 3;

                io.sockets.in('casebattle').emit('message', {
                    type: 'casebattle',
                    command: 'update',
                    stage: 'refresh',
                    status: caseBattleGames[id]['status'],
                    casebattle: {
                        id: id,
                        players: caseBattleGames[id]['players'],
                        mode: caseBattleGames[id]['mode'],
                        cases: caseBattleGames[id]['cases'],
                        amount: caseBattleGames[id]['amount'],
                        data: {
                            game: {
                                server_seed_hashed: sha256(caseBattleGames[id].game.server_seed),
                                block: caseBattleGames[id].game.block,
                                nonce: caseBattleGames[id].id
                            },
                            draw: null,
                            countdown: config.games.games.casebattle.timer_countdown
                        }
                    }
                });

                setTimeout(async () => {
                    caseBattleGames[id].status = 4;
                    caseBattleGames[id].game.public_seed = eosData.hash;
                    caseBattleGames[id].game.block = eosData.block;

                    let round = 0;
                    let winnings = [];

                    await roundRoll(id, round, winnings, totalPlayers, roll, io);

                }, config.games.games.casebattle.timer_countdown * 1000 + 1000);
            });

    }, config.games.games.casebattle.timer_wait_start * 1000 + 1000);
}

const roundRoll = async (id, round, winnings, totalPlayers, roll, io) => {
    caseBattleGames[id]['round'] = round;

    const items = getItems(caseBattleCases[caseBattleGames[id]['cases'][round].id].items);
    const tickets = generateTickets(items);
    const total = tickets[tickets.length - 1].max;

    if(!caseBattleGames[id].privacy) {
        io.sockets.in('casebattle').emit('message', {
            type: 'casebattle',
            command: 'edit',
            status: caseBattleGames[id].status,
            casebattle: {
                id: id,
                players: caseBattleGames[id]['players'],
                mode: caseBattleGames[id]['mode'],
                cases: caseBattleGames[id]['cases'],
                amount: caseBattleGames[id]['amount'],
                free: caseBattleGames[id]['free'],
                time: caseBattleGames[id]['time'],
                data: {
                    round: caseBattleGames[id]['round']
                }
            }
        });
    }

    const roundWinnings = {};

    for(let i = 0; i < totalPlayers; i++) {
        const spinner = generateSpinner(items);
        const rollPosition = parseInt(roll[round][i] * total) + 1;
        let winningItem = null;

        for (let j = 0; j < tickets.length; j++) {
            if (rollPosition >= tickets[j].min && rollPosition <= tickets[j].max) {
                winningItem = {
                    id: items[j].id,
                    name: items[j].name,
                    image: items[j].image,
                    price: getFormatAmount(items[j].price),
                    color: getColorByQuality(items[j].quality)
                };
                break;
            }
        }

        spinner[99] = { image: winningItem?.image, price: winningItem?.price };

        io.sockets.in('casebattle').emit('message', {
            type: 'casebattle',
            command: 'update',
            stage: 'position',
            status: caseBattleGames[id].status,
            position: i,
            casebattle: {
                id: id,
                players: caseBattleGames[id]['players'],
                mode: caseBattleGames[id]['mode'],
                cases: caseBattleGames[id]['cases'],
                amount: caseBattleGames[id]['amount'],
                data: {
                    spinner: spinner,
                    positions: getWinners(caseBattleGames[id]['players'], caseBattleGames[id]['mode'], caseBattleGames[id]['crazy']).reduce((acc, obj) => { return [...acc, ...obj.winners] }, [])
                }
            }
        });

        roundWinnings[i] = winningItem;
    }

    io.sockets.in('casebattle').emit('message', {
        type: 'casebattle',
        command: 'update',
        stage: 'roll',
        casebattle: {
            id: id
        }
    });

    io.sockets.in('casebattle').emit('message', {
        type: 'casebattle',
        command: 'update',
        stage: 'round',
        round: round,
        casebattle: {
            id: id
        }
    });

    setTimeout(() => {
        for (let i = 0; i < totalPlayers; i++) {
            const winning = getFormatAmount(roundWinnings[i]?.price);

            caseBattleGames[id]['players'][caseBattleGames[id]['players'].slice().findIndex(a => a.position === i)].items.push(roundWinnings[i]);
            caseBattleGames[id]['players'][caseBattleGames[id]['players'].slice().findIndex(a => a.position === i)].total += winning;

            winnings.push({
                'caseid': caseBattleGames[id]['cases'][round].id,
                'itemid': roundWinnings[i].id,
                'position': i
            });
        }

        io.sockets.in('casebattle').emit('message', {
            type: 'casebattle',
            command: 'update',
            stage: 'items',
            players: caseBattleGames[id]['players'].map(a => ({ position: a.position, item: a.items.slice(-1)[0], total: a.total })),
            positions: getWinners(caseBattleGames[id]['players'], caseBattleGames[id]['mode'], caseBattleGames[id]['crazy']).reduce((acc, obj) => { return [...acc, ...obj.winners] }, []),
            casebattle: {
                id: id,
                mode: caseBattleGames[id]['mode']
            }
        });

        round++;

        setTimeout(() => {
            if(round >= caseBattleGames[id]['cases'].length)
                return roundFinish(id, winnings, io);

            roundRoll(id, round, winnings, totalPlayers, roll, io);
        }, 3000);
    }, 6000);
}

const roundFinish = async (id, winnings, io) => {
    try {
        const winnersPositionsAll = getWinners(caseBattleGames[id].players, caseBattleGames[id].mode, caseBattleGames[id].crazy);

        if (winnersPositionsAll.length == 1)
            return drawFinish(id, 0, winnings, io);

        generateEosSeed((eosData) => {
            caseBattleGames[id].status = 5;
            caseBattleGames[id].draw.block = eosData.block;

            io.sockets.in('casebattle').emit('message', {
                type: 'casebattle',
                command: 'update',
                stage: 'refresh',
                status: caseBattleGames[id].status,
                casebattle: {
                    id: id,
                    players: caseBattleGames[id].players,
                    mode: caseBattleGames[id].mode,
                    cases: caseBattleGames[id].cases,
                    amount: caseBattleGames[id].amount,
                    data: {
                        game: {
                            server_seed_hashed: sha256(caseBattleGames[id].game.server_seed),
                            block: caseBattleGames[id].game.block,
                            nonce: caseBattleGames[id].id
                        },
                        draw: {
                            block: caseBattleGames[id].draw.block
                        },
                        winners: winnersPositionsAll.reduce((acc, obj) => { return [...acc, ...obj.winners] }, [])
                    }
                }
            });
        }, async (eosData) => {
            await CasebattleDraws.update(
                { removed: 1 },
                { where: { gameid: caseBattleGames[id].id } }
            );

            const seed = getCombinedSeed(caseBattleGames[id].game.server_seed, eosData.hash, caseBattleGames[id].id);
            const salt = generateSaltHash(seed);
            const roll = getRoll(salt, winnersPositionsAll.length);

            await CasebattleDraws.create({
                gameid: caseBattleGames[id].id,
                blockid: eosData.block,
                public_seed: eosData.hash,
                roll: JSON.stringify(roll),
                time: time()
            });

            caseBattleGames[id].draw.public_seed = eosData.hash;
            caseBattleGames[id].draw.block = eosData.block;

            drawFinish(id, roll, winnings, io);
        });
    } catch (error) {
        console.error('Error in roundFinish:', error);
        io.sockets.in('casebattle').emit('message', {
            type: 'error',
            error: 'Error: ' + error.message
        });
    }
}

const drawFinish = async (id, roll, winnings, io) => {
        const winnersPositionsAll = getWinners(caseBattleGames[id]['players'], caseBattleGames[id]['mode'], caseBattleGames[id]['crazy']);
        const winnersPositions = winnersPositionsAll.filter(a => a.position == roll)[0].winners;

        const winners = caseBattleGames[id]['players'].slice().filter(a => winnersPositions.includes(a.position));
        const opponents = caseBattleGames[id]['players'].slice().filter(a => !winnersPositions.includes(a.position));

        await CasebattleGames.update(
            { ended: 1 },
            { where: { id: caseBattleGames[id].id } }
        );

        let winning = 0;

        caseBattleGames[id]['players'].forEach(item => {
            winning = getFormatAmount(winning + item.total);
        });

        await startFinishProcess(0, winners, id, winning, winnings, io).then(async () => {
            await finishGameBet(0, opponents, id, winning, io).then(async () => {
                await CasebattleItems.create({
                    gameid: caseBattleGames[id].id,
                    // items: JSON.stringify(caseBattleGames[id]['players'].map(player => player.items).flat()),
                    items: JSON.stringify(winnings),
                    time: time()
                });
        
                caseBattleGames[id].status = 6;
        
                io.sockets.in('casebattle').emit('message', {
                    type: 'casebattle',
                    command: 'update',
                    stage: 'refresh',
                    status: caseBattleGames[id]['status'],
                    casebattle: {
                        id: id,
                        players: caseBattleGames[id]['players'],
                        mode: caseBattleGames[id]['mode'],
                        cases: caseBattleGames[id]['cases'],
                        amount: caseBattleGames[id]['amount'],
                        data: {
                            game: {
                                server_seed_hashed: sha256(caseBattleGames[id].game.server_seed),
                                server_seed: caseBattleGames[id].game.server_seed,
                                public_seed: caseBattleGames[id].game.public_seed,
                                block: caseBattleGames[id].game.block,
                                nonce: caseBattleGames[id].id
                            },
                            draw: caseBattleGames[id].draw,
                            winners: winners.map(a => a.position)
                        }
                    }
                });
        
                io.sockets.in('casebattle').emit('message', {
                    type: 'casebattle',
                    command: 'update',
                    stage: 'finish',
                    casebattle: {
                        id: id
                    }
                });
        
                if (!caseBattleGames[id].privacy) {
                    io.sockets.in('casebattle').emit('message', {
                        type: 'casebattle',
                        command: 'edit',
                        status: caseBattleGames[id].status,
                        casebattle: {
                            id: id,
                            players: caseBattleGames[id]['players'],
                            mode: caseBattleGames[id]['mode'],
                            cases: caseBattleGames[id]['cases'],
                            amount: caseBattleGames[id]['amount'],
                            free: caseBattleGames[id]['free'],
                            time: caseBattleGames[id]['time'],
                            data: {
                                winners: winners.map(a => a.position)
                            }
                        }
                    });
                }
        
                setTimeout(() => {
                    if (!caseBattleGames[id].privacy) {
                        io.sockets.in('casebattle').emit('message', {
                            type: 'casebattle',
                            command: 'remove',
                            casebattle: {
                                id: id
                            }
                        });
                    }

                    caseBattleStats.active--;
        
                    io.sockets.in('casebattle').emit('message', {
                        type: 'casebattle',
                        command: 'stats',
                        stats: caseBattleStats
                    });
        
                    delete caseBattleGames[id];
                }, config.games.games.casebattle.timer_delete * 1000);
        
                winners.forEach(item => {
                    const winningsAmount = caseBattleGames[id].mode == 3
                        ? [getFormatAmount(winning / 2), getFormatAmount(winning - getFormatAmount(winning / 2))][item.position % 2]
                        : winning;

                    if (winningsAmount >= config.games.winning_to_chat) {
                        const sendMessage = `${item.user.name} won ${getFormatAmountString(winningsAmount)} to case battle!`;
                        otherMessages(sendMessage, io.sockets, true);
                    }

                    io.sockets.in(item.user.userid).emit('message', {
                        type: 'success',
                        success: `The game of ${getFormatAmountString(winningsAmount)} on case battle ended as win!`
                    });
                    updateBalance(item.user.userid, io);
                    updateLevel(item.user.userid, io);
                });

                opponents.forEach(item => {
                    io.sockets.in(item.user.userid).emit('message', {
                        type: 'error',
                        error: `The game of ${getFormatAmountString(winning)} on case battle ended as lose!`
                    });

                    updateLevel(item.user.userid, io);
                });
            });
        });
}

const startFinishProcess = async (index, winners, id, winning, winnings, io) => {
    if (index >= winners.length) return;

    let winningsItems = winnings;
    let winningsAmount = winning
    let winningsAmountAdd = 0;

    if(caseBattleGames[id].mode == 3) {
        winningsItems = [];
        winningsAmount = [
            getFormatAmount(winning / 2),
            getFormatAmount(winning - getFormatAmount(winning / 2))
        ][winners[index].position % 2];

        winningsAmountAdd = winningsAmount;
    }

    await finishBet(winners[index].user.userid, caseBattleGames[id].amount, winningsAmount, winningsAmountAdd, winningsItems.slice().map(a => a.itemid), 'casebattle', async (err, items) => {
        if(err) {
            console.log(err);
            return;
        }

        await CasebattleWinnings.create({
            gameid: caseBattleGames[id].id,
            items: JSON.stringify(items.slice().map(a => a.id)),
            amount: winningsAmountAdd,
            position: winners[index].position,
            time: time()
        });

        if (!winners[index].bot) {
            return startFinishProcess(index + 1, winners, id, winning, winnings, io);
        }

        await sellAllGameItems({ userid: winners[index].user.userid }, 0, items, [], async (err, itemsSuccess) => {
            if (err) {
                console.log(err);
                return;
            }

            const amountSold = itemsSuccess.reduce((acc, val) => {
                return getFormatAmount(acc + getItemDetails(val.itemid).price)
            }, 0);

            await editBalance(winners[index].user.userid, amountSold, 'sell_items', async (err) => {
                if (err) {
                    console.log(err);
                    return;
                }

                return startFinishProcess(index + 1, winners, id, winning, winnings, io);
            });
        });
    });
};

const finishGameBet = async (index, opponents, id, winning, io) => {
    if (index >= opponents.length) return;

    await finishBet(opponents[index].user.userid, caseBattleGames[id].amount, 0, 0, [], 'casebattle', async (err) => {
        if(err) {
            console.log(err);
            return;
        }

        return finishGameBet(index + 1, opponents, id, winning, io);
        // const cashback = getFormatAmount(getFeeFromCommission(caseBattleGames[id].amount, config.games.games.casebattle.cashback));

        // await editBalance(opponents[index].user.userid, cashback, 'casebattle_cashback', async (err) => {
        //     if (err) {
        //         console.log(err);
        //         return;
        //     }

        //     await updateBalance(opponents[index].user.userid, io);

        //     return finishGameBet(index + 1, opponents, id, winning, io);
        // });
    });
};

const generateTickets = (items) => {
    let decimals = 0;
    items.forEach((item) => {
        if(countDecimals(item.chance) > decimals)
            decimals = countDecimals(item.chance);
    });

    const tickets = [];
    let total = 0;

    items.forEach((item) => {
        tickets.push({
            min: total + 1,
            max: total + item.chance * Math.pow(10, decimals),
        });
        total += item.chance * Math.pow(10, decimals);
    });

    return tickets;
}

const generateSpinner = (items) => {
    const tickets = generateTickets(items);
    const total = tickets[tickets.length - 1].max;

    const spinner = [];

    for(let i = 0; i < 150; i++) {
        const ticket = getRandomInt(1, total);

        for(let j = 0; j < tickets.length; j++) {
            if(ticket >= tickets[j].min && ticket <= tickets[j].max) {
                spinner.push({
                    image: items[j].image,
                });
            }
        }
    }

    return spinner;
}

const getWinners = (players, mode, crazy) => {
    if (mode === 3) {
        const totalTeam = [
            { position: 0, total: 0 },
            { position: 1, total: 0 }
        ];

        players.forEach((item) => {
            totalTeam[totalTeam.findIndex(a => a.position === parseInt(item.position / 2))].total += item.total;
        });

        if (crazy) {
            const minTotalTeam = Math.min(...totalTeam.map(team => team.total));
            return totalTeam.filter(a => a.total <= minTotalTeam)
                            .map((a, i) => ({ position: i, winners: [0, 1, 2, 3].slice(a.position * 2, a.position * 2 + 2) }));
        }

        const maxTotalTeam = Math.max(...totalTeam.map(team => team.total));
        return totalTeam.filter(a => a.total >= maxTotalTeam)
                        .map((a, i) => ({ position: i, winners: [0, 1, 2, 3].slice(a.position * 2, a.position * 2 + 2) }));
    }

    if (crazy) {
        const minTotal = Math.min(...players.map(player => player.total));
        return players.filter(a => a.total <= minTotal)
                      .map((a, i) => ({ position: i, winners: [a.position] }));
    }

    const maxTotal = Math.max(...players.map(player => player.total));
    return players.filter(a => a.total >= maxTotal)
                  .map((a, i) => ({ position: i, winners: [a.position] }));
}

const sendEmoji = async (user, socket, id, position, emoji, io) => {
    try {
        if (isNaN(Number(position))) throw new Error('Invalid position!');
        position = parseInt(position);

        if (isNaN(Number(emoji))) throw new Error('Invalid emoji!');
        emoji = parseInt(emoji);

        const allowedEmojis = [0, 1, 2, 3, 4];
        if (!allowedEmojis.includes(emoji)) throw new Error('Invalid emoji!');

        const game = await CasebattleGames.findOne({
            where: {
                battleid: id,
                canceled: 0
            }
        });

        if (!game) throw new Error('Invalid battle id!');

        const bet = await CasebattleBets.findOne({
            where: {
                userid: user.userid,
                gameid: game.id,
                position: position,
                canceled: 0
            }
        });

        if (!bet) throw new Error('Invalid battle id!');

        io.sockets.in('casebattle').emit('message', {
            type: 'casebattle',
            command: 'emoji',
            position: position,
            emoji: emoji,
            casebattle: {
                id: id
            }
        });
    } catch(error) {
        console.error('Error in sendCaseBattleEmoji:', error);
        socket.emit('message', {
            type: 'error',
            error: `Error: ${error.message}`
        });
    }
}

const getCaseBattleBets = () => {
    let bets = [];

    for (const bet in caseBattleGames) {
        if(!caseBattleGames[bet].privacy) {
            const gameData = {};

            if(caseBattleGames[bet].status == 3) {
                gameData.countdown = config.games.games.casebattle.timer_countdown
            } else if(caseBattleGames[bet].status == 4) {
                gameData.round = caseBattleGames[bet].round;
            } else if(caseBattleGames[bet].status == 6) {
                const winnersPositions = getWinners(caseBattleGames[bet].players, caseBattleGames[bet].mode, caseBattleGames[bet].crazy);
                // const seed = getCombinedSeed(caseBattleGames[bet].game.server_seed, caseBattleGames[bet].game.public_seed, bet);
                const seed = getCombinedSeed(caseBattleGames[bet].game.server_seed, caseBattleGames[bet].game.public_seed, caseBattleGames[bet].id);
                const salt = generateSaltHash(seed);
                const roll = getRoll(salt, winnersPositions.length);

                gameData.winners = winnersPositions.filter(a => a.position == roll)[0].winners;
            }

            bets.push({
                status: caseBattleGames[bet].status,
                casebattle: {
                    id: bet,
                    players: caseBattleGames[bet].players,
                    mode: caseBattleGames[bet].mode,
                    cases: caseBattleGames[bet].cases,
                    amount: caseBattleGames[bet].amount,
                    free: caseBattleGames[bet].free,
                    crazy: caseBattleGames[bet].crazy,
                    time: caseBattleGames[bet].time,
                    data: gameData
                }
            });
        }
    }

    return bets;
}

const getGames = () => {
    return caseBattleGames;
}

const getSecure = () => {
    return caseBattleSecure;
}

const getGameStats = () => {
    return caseBattleStats;
}
module.exports = {
    loadStats,
    loadGameCases,
    loadHistory,
    gameShow,
    getFinishedBattles,
    getMyBattles,
    loadCases,
    cerateCaseBattle,
    joinCaseBattle,
    caseBattleJoinConfirm,
    leaveCaseBattle,
    sendEmoji,
    getCaseBattleBets,
    getGameStats,
    getGames,
    getSecure
}