const sequelize = require('../config/db');
const { Users } = require('../models');

const { getFormatAmount, calculateLevel } = require('../utils/helpers');
const { coinflipGames, coinflipSecure, joinConfirm } = require('./coinflipService');
const { getGames, getSecure, caseBattleJoinConfirm } = require('./caseBattleService');
const showBotsForCoinflip = async (socket, gameId) => {
    if(isNaN(Number(gameId)) || !coinflipGames[gameId]) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid game. Please join a valid game!'
        });
    }

    const game = coinflipGames[gameId];
    if(!game) {
        console.log("[COINFLIP] Game not defined in loading bots")
        return;
    }
    if(game.status !== 0) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: This game has already ended!'
        });
    }
    if(!coinflipSecure[gameId]) {
        console.log("[COINFLIP] Secure gameid not found for ", gameId);
        return;
    }
    if(Object.keys(coinflipSecure[gameId]).length > 0) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Another user is trying to join this game. Please try again later!'
        });
    }

    const amount = getFormatAmount(game.amount);

    const bots = await sequelize.query(
        `SELECT 
            u.userid, 
            u.name, 
            u.avatar, 
            u.xp, 
            u.balance,
            COUNT(cw.id) AS bets,
            SUM(IF(cb.position = cw.position, 1, 0)) AS winnings
        FROM users u
        LEFT JOIN coinflip_bets cb ON u.userid = cb.userid
        LEFT JOIN coinflip_games cg ON cb.gameid = cg.id
        LEFT JOIN coinflip_winnings cw ON cb.gameid = cw.gameid
        WHERE u.bot = 1 
        AND (cg.canceled = 0 OR cg.canceled IS NULL) 
        AND (cg.ended = 1 OR cg.ended IS NULL)
        GROUP BY u.userid;`,
        { type: sequelize.QueryTypes.SELECT }
    );

    const avaliableBots = bots.filter(bot => {
        const botBalance = getFormatAmount(bot.balance);
        const isAlreadyInGame = game.players.some(player => player.user.userid === bot.userid);

        return botBalance >= amount && !isAlreadyInGame
    }).map(bot => {

        return {
           user: {
                userid: bot.userid,
                name: bot.name,
                avatar: bot.avatar,
                level: calculateLevel(bot.xp).level
            },
            bets: parseInt(bot.bets, 10),
            winnings: parseInt(bot.winnings, 10)
        }
    });

    return avaliableBots;
}

const confirmBotForCoinflip = async (botId, socket, io, gameId) => {
    const bot = await Users.findOne({ where: { userid: botId, bot: 1 } });
    
    if(!bot)
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid bot!'
        });

    if(isNaN(Number(gameId)) || !coinflipGames[gameId])
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid game. Please join a valid game!'
        });

    const game = coinflipGames[gameId];

    if(game.status !== 0)
        socket.emit('message', {
            type: 'error',
            error: 'Error: This game has already ended!'
        });

    if(game.players.some(player => player.user.userid === bot.userid))
        socket.emit('message', {
            type: 'error',
            error: 'Error: You cannot join your own game!'
        });

    if(Object.keys(coinflipSecure[gameId]).length > 0)
        socket.emit('message', {
            type: 'error',
            error: 'Error: Another user is trying to join this game. Please try again later!'
        });

    const amount = getFormatAmount(game.amount);

    if(getFormatAmount(bot.balance) < amount)
        socket.emit('message', {
            type: 'error',
            error: 'Error: This bot does not have enough balance to join this game!'
        });

    coinflipSecure[gameId][bot.userid] = true;

    joinConfirm(bot, gameId, socket, io, (err) => {
        if(err) return err;
    });

    if(!coinflipSecure[gameId] !== undefined && coinflipSecure[gameId][bot.userid] !== undefined)
        delete coinflipSecure[gameId][bot.userid];

    return {
        userid: bot.userid,
        name: bot.name,
        avatar: bot.avatar,
        level: calculateLevel(bot.xp).level
    }
}

const showBotsForCaseBattle = async (id, position, socket) => {
    if(isNaN(Number(position)))
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid position!'
        });

    const caseBattleGames = getGames();
    const caseBattleSecure = getSecure();

    const totalPlayers = [2, 3, 4, 4][caseBattleGames[id].mode];

    if(caseBattleGames[id] == undefined)
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid Case Battle ID!'
        });

    if(caseBattleGames[id].status !== 0)
        socket.emit('message', {
            type: 'error',
            error: 'Error: This game has already ended!'
        });

    if(position < 0 || position >= totalPlayers)
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid position!'
        });
    
    if(caseBattleGames[id].players.filter(a => a.position == position).length > 0)
        socket.emit('message', {
            type: 'error',
            error: 'Error: This position is already taken!'
        });
    
    if(Object.keys(caseBattleSecure[id][position]).length > 0)
        socket.emit('message', {
            type: 'error',
            error: 'Error: Another user is trying to join this game. Please try again later!'
        });
    
    const amount = getFormatAmount(caseBattleGames[id]['amount']);

    if(caseBattleGames[id]['free'])
        amount = 0;

    const bots = await sequelize.query(
        `SELECT users.userid, users.name, users.avatar, users.xp, users.balance,
         COALESCE(COUNT(casebattle_winnings.id), 0) AS bets,
         COALESCE(SUM(IF(casebattle_bets.position = casebattle_winnings.position, 1, 0)), 0) AS winnings
         FROM users
         LEFT JOIN casebattle_bets ON users.userid = casebattle_bets.userid
         LEFT JOIN casebattle_games ON casebattle_bets.gameid = casebattle_games.id
         LEFT JOIN casebattle_winnings ON casebattle_bets.gameid = casebattle_winnings.gameid
         WHERE users.bot = 1
         AND (casebattle_games.canceled = 0 OR casebattle_games.canceled IS NULL)
         AND (casebattle_games.ended = 1 OR casebattle_games.ended IS NULL)
         GROUP BY users.userid`,
         { type: sequelize.QueryTypes.SELECT }
    );

    const availableBots = bots.filter(bot => {
        const botBalance = getFormatAmount(bot.balance);
        const isAlreadyInGame = caseBattleGames[id].players.some(player => player.user.userid === bot.userid);

        return botBalance >= amount && !isAlreadyInGame;
    }).map(bot => ({
        user: {
            userid: bot.userid,
            name: bot.name,
            avatar: bot.avatar,
            level: calculateLevel(bot.xp).level
        },
        bets: parseInt(bot.bets, 10),
        winnings: parseInt(bot.winnings, 10)
    }));

    return availableBots;
}

const confirmBotForCaseBattle = async (userid, id, position, socket, io) => {
    try {
        const bot = await Users.findOne({ where: { userid, bot: 1 } });

        if(!bot) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: Invalid bot!'
            });
        }

        if(isNaN(Number(position))) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: Invalid position!'
            });
        }

        const caseBattleGames = getGames();

        if(caseBattleGames[id] == undefined) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: Invalid Case Battle ID!'
            });
        }

        if(caseBattleGames[id].status !== 0) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: This game has already ended!'
            });
        }

        const totalPlayers = [2, 3, 4, 4][caseBattleGames[id].mode];

        if(position < 0 || position >= totalPlayers) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: Invalid position!'
            });
        }

        if(caseBattleGames[id].players.some(a => a.position == position)) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: This position is already taken!'
            });
        }

        if(caseBattleGames[id].players.some(a => a.user.userid == bot.userid)) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: This bot already joined in this game!'
            });
        }

        const caseBattleSecure = getSecure();

        if (caseBattleSecure[id][position] && Object.keys(caseBattleSecure[id][position]).length > 0) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: Another user is trying to join this game. Please try again later!'
            });
        }

        const amount = getFormatAmount(caseBattleGames[id]['amount']);

        if(caseBattleGames[id]['free'])
            amount = 0;

        if(getFormatAmount(bot.balance) < amount) {
            return socket.emit('message', {
                type: 'error',
                error: 'Error: This bot doesn\'t have enough coins to join this game!'
            });
        }

        caseBattleSecure[id][position][bot.userid] = true;

        await caseBattleJoinConfirm(bot, id, position, socket, io);

        if (caseBattleSecure[id] && caseBattleSecure[id][position] && caseBattleSecure[id][position][bot.userid]) {
            delete caseBattleSecure[id][position][bot.userid];
        }

        return {
            userid: bot.userid,
            name: bot.name,
            avatar: bot.avatar,
            level: calculateLevel(bot.xp).level
        }
    } catch(error) {
        console.error('Error in confirmBotForCaseBattle:', error);
        socket.emit('message', {
            type: 'error',
            error: 'Error: ' + error.message
        });
    }
}

module.exports = {
    showBotsForCoinflip,
    confirmBotForCoinflip,
    showBotsForCaseBattle,
    confirmBotForCaseBattle
}