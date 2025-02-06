const PlinkoBet = require('../models/PlinkoBet');
const UsersSeedServer = require('../models/UsersSeedServer');

const { updateBalance, registerBet, finishBet, updateLevel } = require('./bettingService');
const config = require('../config');
const {
    generateSaltHash,
    getRollPlinko,
    getCombinedSeed,
    getUserSeeds
} = require('../utils/fair');

const {
    getFormatAmount,
    calculateLevel,
    roundedToFixed,
    time
} = require('../utils/helpers');

const plinkoGames = [];
const plinkoCooldown = [];

const loadHistory = async () => {
    console.log('[PLINKO] Loading History');

    const bets = await PlinkoBet.findAll({
        limit: 10,
        order: [['id', 'DESC']]
    });

    bets.reverse().forEach(item => {
        plinkoGames.push({
            id: item.id,
            user: {
                userid: item.userid,
                name: item.name,
                avatar: item.avatar,
                level: calculateLevel(item.xp).level
            },
            amount: getFormatAmount(item.amount),
            game: item.game,
            roll: item.roll,
            multiplier: roundedToFixed(item.multiplier, 2),
        });
    })
};

const placeBet = async (user, socket, io, amount, game, cooldown) => {
    if(!user) {
        console.log("[PLINKO] Failed to place a bet: User not found!");
        return;
    }
    if(plinkoCooldown[user.userid]) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Wait for ending last plinko game!'
        });
        return;
    }

    plinkoCooldown[user.userid] = true;
    cooldown(true, true);

    const allowedGames = ['low', 'medium', 'high'];

    if (!allowedGames.includes(game)) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid game type!'
        });

        plinkoCooldown[user.userid] = false;
        return cooldown(false, true);
    }

    amount = parseFloat(amount);
    if(isNaN(amount) || amount < 0) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid bet amount!'
        });
        plinkoCooldown[user.userid] = false;
        return cooldown(false, true);
    }

    await registerBet(user.userid, amount, [], 'plinko', true, io, async (err) => {
        if (err) {
            socket.emit('message', {
                type: 'error',
                error: err.message
            });
            plinkoCooldown[user.userid] = false;
            return cooldown(false, true);
        }

        await updateBalance(user.userid, io);

        const fair = await getUserSeeds(user.userid);

        const seed = getCombinedSeed(fair.serverSeed, fair.clientSeed, fair.nonce);
        const salt = generateSaltHash(seed);
        const rollArray = getRollPlinko(salt);
        const roll = rollArray.join('');
        const result = rollArray.reduce((acc, val) => acc + val, 0);

        const multiplier = config.games.games.plinko.results[game][result];
        const winning = getFormatAmount(amount * multiplier);

        const newBet = await PlinkoBet.create({
            userid: user.userid,
            name: user.name,
            avatar: user.avatar,
            xp: user.xp,
            amount,
            game,
            multiplier,
            roll,
            server_seedid: fair.serverSeedId,
            client_seedid: fair.clientSeedId,
            nonce: fair.nonce,
            time: time()
        });

        await UsersSeedServer.update(
            {nonce: fair.nonce + 1},
            {where: {id: fair.serverSeedId}}
        );

        await finishBet(user.userid, amount, winning, winning, [], 'plinko', async (err) => {
            if (err) {
                socket.emit('message', {
                    type: 'error',
                    error: err.message
                });
                plinkoCooldown[user.userid] = false;
                return cooldown(false, true);
            }

            socket.emit('message', {
                type: 'plinko',
                command: 'bet',
                id: newBet.id,
                plinko: rollArray,
                game
            });

            setTimeout(async () => {
                const history = {
                    id: newBet.id,
                    user: {
                        userid: user.userid,
                        avatar: user.avatar,
                        name: user.name,
                        level: calculateLevel(user.xp).level
                    },
                    amount: getFormatAmount(amount),
                    game,
                    roll,
                    multiplier,
                    commission : config.games.commissions.plinko
                }

                plinkoGames.push(history);

                if(plinkoGames.length > 10) plinkoGames.shift();

                io.sockets.in('plinko').emit('message', {
                    type: 'plinko',
                    command: 'history',
                    history,
                });
    
                await updateLevel(user.userid, io);
                await updateBalance(user.userid, io);
    
                if(winning >= config.games.winning_to_chat) {
                    const message = `${user.name} won ${getFormatAmount(winning)} in Plinko with multiplier x${roundedToFixed(multiplier, 2)}!`;
                    io.sockets.in('plinko').emit('message', {
                        type: 'chat',
                        command: 'message',
                        message: {
                            type: 'system',
                            message,
                            time: new Date().getTime()
                        },
                        added: false
                    });
                }
                console.log(`[PLINKO] Win registed. ${user.name} did win $${getFormatAmount(winning).toFixed(2)} with multiplier x${roundedToFixed(multiplier, 2).toFixed(2)}`);
            }, 4000);

            setTimeout(() => {
                plinkoCooldown[user.userid] = false;
            }, 100);

            console.log(`[PLINKO] Bet registed. ${user.name} did bet $${getFormatAmount(amount).toFixed(2)}`);

            cooldown(false, false);
        });
    })
};

module.exports = {
    loadHistory,
    placeBet,
    plinkoGames
};
