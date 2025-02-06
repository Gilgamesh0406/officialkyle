const sha256 = require('sha256');
const CoinflipGame = require('../models/CoinflipGame');
const CoinflipBet = require('../models/CoinflipBet');
const CoinflipRoll = require('../models/CoinflipRoll');
const CoinflipWinnings = require('../models/CoinflipWinnings');

const { updateBalance, registerBet, finishBet, updateLevel, refundBet } = require('./bettingService');

const config = require('../config');

const {
    generateServerSeed,
    generateEosSeed,
    getCombinedSeed,
    getRoll,
    generateSaltHash
} = require('../utils/fair');

const {
    getFormatAmount,
    calculateLevel,
    getFormatAmountString,
    time
} = require('../utils/helpers');

const { verifyFormatAmount } = require('../utils/site');

const coinflipGames = {};
const coinflipSecure = {};

const loadHistory = async (io) => {
    console.log('[COINFLIP] Loading History');

    try {
        const games = await CoinflipGame.findAll({
            where: {
                ended: 0,
                canceled: 0
            },
            order: [['id', 'DESC']]
        });

        games.forEach((game) => {
            const amount = getFormatAmount(game.amount);

            coinflipGames[game.id] = {
                id: game.id,
                status: 0,
                players: [],
                amount,
                game: {
                    server_seed: game.server_seed,
                    public_seed: null,
                    block: null,
                    roll: null
                },
                time: null,
                timeout: null,
            };

            coinflipSecure[game.id] = {};

            loadBets(game.id, io);
        });
    } catch(error) {
        console.log('Error loading coinflip history : ', error);
    }
};

const loadBets = async (gameId, io) => {
    try {
        const bets = await CoinflipBet.findAll({
            where: {gameid: gameId}
        });

        if(bets.length > 1) {
            coinflipGames[gameId].status = 1;
            coinflipGames[gameId].time = Date.now();
        }

        bets.forEach(bet => {
            coinflipGames[gameId]['players'].push({
                user: {
                    userid: bet.userid,
                    name: bet.name,
                    avatar: bet.avatar,
                    level: calculateLevel(bet.xp).level
                },
                position: parseInt(bet.position),
                creator: parseInt(bet.creator),
                bot: parseInt(bet.bot)
            })
        });

        if(bets.length > 1) {
            // if(!io) {
            //     console.log("[COINFLIP] Load error: IO not defined")
            //     return;
            // }
            continueGame(gameId, io);
        } else {
            handleCancellation(gameId);
        }
    } catch(error) {
        console.error('Error loading coinflip bets : ', error);
    }
}

const createGame = async (user, socket, io, amount, position) => {
    if (isNaN(Number(position)) || ![0, 1].includes(parseInt(position))) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid position!'
        });
    }

    if(!user) {
        socket.emit('message', {
            type: 'error',
            error: 'Please log in to create a game!'
        });
        return;
    }

    const currentGames = await CoinflipGame.findAll({
        include: [{
            model: CoinflipBet,
            where: {
                userid: user.userid,
                creator: 1
            }
        }],
        where: { ended: 0, canceled: 0 },
        order: [['id', 'DESC']]
    });

    if(currentGames.length >= config.games.games.coinflip.max_game_count) {
        socket.emit('message', {
            type: 'error',
            error: 'You reached the limit of games you can create !'
        });
        return;
    }

    position = parseInt(position);

    verifyFormatAmount(amount, (err, amount) => {
        if(err) {
            socket.emit('message', {
                type: 'error',
                error: err.message
            });
        }

        registerBet(user.userid, amount, [], 'coinflip', true, io, async (regBetError) => {
            if(regBetError) {
                socket.emit('message', {
                    type: 'error',
                    error: regBetError.message
                });
            } else {
                const server_seed = generateServerSeed();

                const newGame = await CoinflipGame.create({
                    amount,
                    server_seed,
                    time: time()
                });

                await CoinflipBet.create({
                    userid: user.userid,
                    name: user.name,
                    avatar: user.avatar,
                    xp: user.xp,
                    bot: user.bot,
                    gameid: newGame.id,
                    position,
                    creator: 1,
                    time: time()
                });

                coinflipGames[newGame.id] = {
                    id: newGame.id,
                    status: 0,
                    players: [{
                        user: {
                            userid: user.userid,
                            name: user.name,
                            avatar: user.avatar,
                            level: calculateLevel(user.xp).level
                        },
                        position,
                        creator: 1,
                        bot: user.bot
                    }],
                    amount,
                    game: {
                        server_seed: server_seed,
                        public_seed: null,
                        block: null,
                        roll: null
                    },
                    time: null,
                    timeout: null
                };

                coinflipSecure[newGame.id] = {};

                socket.emit('message', {
                    type: 'coinflip',
                    command: 'bet_confirmed'
                });

                io.sockets.in('coinflip').emit('message', {
                    type: 'coinflip',
                    command: 'add',
                    coinflip: {
                        id: coinflipGames[newGame.id].id,
                        players: coinflipGames[newGame.id].players,
                        amount: coinflipGames[newGame.id].amount,
                        data: {
                            game: {
                                server_seed_hashed: sha256(coinflipGames[newGame.id].game.server_seed),
                                nonce: coinflipGames[newGame.id].id
                            }
                        }
                    }
                });

                if(config.games.games.coinflip.cancel) {
                    coinflipGames[newGame.id].timeout = setTimeout(async () => {
                        await CoinflipGame.update({ canceled: 1 }, { where: { id: newGame.id } });
                    
                        await refundBet(user.userid, amount, 'coinflip', (error) => {
                            if(error) {
                                console.log("[COINFLIP] Refund error", error);
                                return;
                            }
                        });
                        await updateBalance(user.userid, io);
                    
                        delete coinflipGames[newGame.id];
                    
                        io.sockets.in('coinflip').emit('message', {
                            type: 'coinflip',
                            command: 'remove',
                            coinflip: { id: newGame.id }
                        });
                    }, config.games.games.coinflip.timer_cancel * 1000);
                }

                await updateBalance(user.userid, io);

                console.log('[COINFLIP] Bet registed. ' + user.name + ' did bet $' + getFormatAmountString(amount));
            }
        });
    });
};

const joinGame = async (user, socket, io, gameId) => {
    if (isNaN(Number(gameId)) || !coinflipGames[gameId]) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Invalid game. Please join a valid game!'
        });
    }

    if(!user) {
        socket.emit('message', {
            type: 'error',
            error: 'Please log in to join this game!'
        });
        return;
    }

    const game = coinflipGames[gameId];

    if(game.status != 0) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: This game has already ended!'
        });
    }

    if(game.players.some(player => player.user.userid === user.userid)) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: You cannot join your own game!'
        });
    }

    if(Object.keys(coinflipSecure[gameId]).length > 0) {
        socket.emit('message', {
            type: 'error',
            error: 'Error: Another user is trying to join this game. Please try again later!'
        });
    }

    coinflipSecure[gameId][user.userid] = true;

    joinConfirm(user, gameId, socket, io, (err) => {
        if(err) {
            socket.emit('message', {
                type: 'error',
                error: err.message
            });
        }

        socket.emit('message', {
			type: 'coinflip',
			command: 'bet_confirmed',
		});

        updateBalance(user.userid, io);
    })
}

const joinConfirm = (user, gameId, socket, io, callback) => {
    const game = coinflipGames[gameId];
    const amount = getFormatAmount(game.amount);
    const position = game.players[0].position === 0 ? 1 : 0;

    registerBet(user.userid, amount, [], 'coinflip', false, io, async (err) => {
        if(err) {
            socket.emit('message', {
                type: 'error',
                error: err.message
            });
        } else {
            await CoinflipBet.create({
                userid: user.userid,
                name: user.name,
                avatar: user.avatar,
                xp: user.xp,
                bot: user.bot,
                gameid: gameId,
                position: position,
                creator: 0,
                time: time()
            });

            game.time = time();
            game.status = 1;
            game.players.push({
                user: {
                    userid: user.userid,
                    name: user.name,
                    avatar: user.avatar,
                    level: calculateLevel(user.xp).level
                },
                position: position,
                creator: 0,
                bot: user.bot
            });
    
            io.sockets.in('coinflip').emit('message', {
                type: 'coinflip',
                command: 'edit',
                status: game.status,
                coinflip: {
                    id: gameId,
                    players: game['players'],
                    amount: game['amount'],
                    data: {
                        game: {
                            server_seed_hashed: sha256(game.game.server_seed),
                            nonce: gameId
                        },
                        time: config.games.games.coinflip.timer_wait_start - time() + game.time
                    }
                }
            });
    
            if(game.status == 1) continueGame(game.id, io);
            
            // console.log('[COINFLIP] DEBUG:', game)
            console.log('[COINFLIP] Join registed. ' + user.name + ' did bet $' + getFormatAmountString(amount));
    
            return callback(null);
        }
    });
}

const continueGame = (gameId, io) => {
    delete coinflipSecure[gameId];
    setTimeout(() => {
        const game = coinflipGames[gameId];
        console.log('[COINFLIP] EOS:', gameId, game.status)
        generateEosSeed((data) => {
            game.status = 2;
            game.game.block= data.block;
            // console.log('[DEBUG] io and gameId', gameId, io)
            if(!io) {
                console.log('[ERROR] IO undefined.', gameId)
                return;
            } else {
                io.sockets.in('coinflip').emit('message', {
                    type: 'coinflip',
                    command: 'edit',
                    status: game.status,
                    coinflip: {
                        id: gameId,
                        players: game['players'],
                        amount: game['amount'],
                        data: {
                            game: {
                                server_seed_hashed: sha256(game.game.server_seed),
                                block: game.game.block,
                                nonce: gameId
                            }
                        }
                    }
                });
            }
            
        }, async (data) => {

            await CoinflipRoll.update({ removed: 1 }, {where: {gameid: gameId}});

            const seed = getCombinedSeed(game.game.server_seed, data.hash, gameId);
            const salt = generateSaltHash(seed);
            const roll = getRoll(salt, Math.pow(10, 8)) / Math.pow(10, 8);

            await CoinflipRoll.create({
                gameid: gameId,
                blockid: data.block,
                public_seed: data.hash,
                roll,
                time: Date.now()
            });

            game.status = 3;
            game.game.public_seed = data.hash;
            game.game.block = data.block;
            game.game.roll = roll;
            if(io) {
                io.sockets.in('coinflip').emit('message', {
                    type: 'coinflip',
                    command: 'edit',
                    status: game.status,
                    coinflip: {
                        id: gameId,
                        players: game['players'],
                        amount: game['amount'],
                        data: {
                            game: {
                                server_seed_hashed: sha256(game.game.server_seed),
                                block: game.game.block,
                                nonce: gameId
                            },
                            winner: getWinner(gameId)
                        }
                    }
                });
            } else {
                console.log("[COINFLIP] IO not defined: setting game to status 3")
            }
            

            setTimeout(async () => {
                await CoinflipGame.update({ ended: 1 }, { where: { id: gameId } });

                const winnerPosition = getWinner(gameId);
                const winner = game.players.find(player => player.position === winnerPosition);
                const opponent = game.players.find(player => player.position !== winnerPosition);

                await CoinflipGame.update({ended: 1}, { where: { id: gameId}})

                const winning = getFormatAmount(getFormatAmount(game.amount) * 2);

                await CoinflipWinnings.create({
                    gameid: gameId,
                    position: winner.position,
                    time: Date.now()
                });

                finishBet(winner.user.userid, game.amount, winning, winning, [], 'coinflip', async (firstFinishBetErr) => {
                    if(firstFinishBetErr) {
                        console.log('[Coinflip] first finish bet error', firstFinishBetErr);
                    }

                    finishBet(opponent.user.userid, game.amount, 0, 0, [], 'coinflip', (secondFinishBetErr) => {
                        if(secondFinishBetErr) {
                            console.log('[Coinflip] first finish bet error', secondFinishBetErr);
                        }

                        game.status = 4;
                        // console.log("[COINFLIP] Finishing Bet", game)
                        if(io) {
                            io.in('coinflip').emit('message', {
                                type: 'coinflip',
                                command: 'edit',
                                status: game.status,
                                coinflip: {
                                    id: gameId,
                                    players: game['players'],
                                    amount: game['amount'],
                                    data: {
                                        game: {
                                            server_seed_hashed: sha256(game.game.server_seed),
                                            server_seed: game.game.server_seed,
                                            public_seed: game.game.public_seed,
                                            block: game.game.block,
                                            nonce: gameId
                                        },
                                        winner: getWinner(gameId)
                                    }
                                }
                            });
                        } else {
                            console.log("[COINFLIP] IO not defined: setting game to status 4")
                        }
                        

                        if(winning >= config.games.winning_to_chat){
                            const send_message = winner.user.name + ' won ' + getFormatAmountString(winning) + ' to coinflip!';
                            otherMessages(send_message, io.sockets, true);
                        }
                        if (io) {
                            io.in(winner.user.userid).emit('message', {
                                type: 'success',
                                success: 'The game of ' + getFormatAmountString(winning) + ' on coinflip ended as win!'
                            });
    
                            io.in(opponent.user.userid).emit('message', {
                                type: 'error',
                                error: 'The game of ' + getFormatAmountString(winning) + ' on coinflip ended as lose!'
                            });
                        }
                        

                        setTimeout(function(){
                            delete coinflipGames[gameId];
                            if(io) {
                                io.in('coinflip').emit('message', {
                                    type: 'coinflip',
                                    command: 'remove',
                                    coinflip: {
                                        id: gameId
                                    }
                                });
                            }                            
                        }, config.games.games.coinflip.timer_delete * 1000);
                        if(io) {
                            updateLevel(winner.user.userid, io);
                            updateLevel(opponent.user.userid, io);
    
                            updateBalance(winner.user.userid, io);
                        }
                        

                        console.log('[COINFLIP] Win registed. ' + winner.user.name + ' did win $' + getFormatAmountString(winning));
                    })
                });

            }, 4000);
        });
    }, config.games.games.coinflip.timer_wait_start * 1000 + 1000);
};

const cancelGame = async (user, socket, io, gameId) => {
    try {
        const game = coinflipGames[gameId];
        if(!game) return;
        const amount = getFormatAmount(game.amount);
        await refundBet(user.userid, amount, 'coinflip', () =>{
            handleCancellation(gameId);
            io.sockets.in('coinflip').emit('message', {
                type: 'coinflip',
                command: 'remove',
                coinflip: {
                    id: gameId
                }
            });
            setTimeout(() => {
                socket.emit('message', {
                    type: 'error',
                    error: 'Cancelled coinflip game.'
                });
                updateBalance(user.userid, io);
            }, 500)
        });
       
        
    } catch (error) {
        console.log("[COINFLIP] Error while cancelling the game.", error);
        socket.emit('message', {
            type: 'error',
            error: 'Error while cancelling the game. Please try again later.'
        });
    }
}

/**
 * Determines the winner of a coinflip game based on the game's roll value.
 * 
 * @param {string} gameId - The ID of the coinflip game.
 * @returns {number} The index of the winning player (0 or 1).
 */
const getWinner = (gameId) => {
    return coinflipGames[gameId].game.roll < 0.5 ? 0 : 1;
}

/**
 * Handles the cancellation of a coinflip game.
 * If the game can be canceled based on the configuration, this function will:
 * - Check if the cancellation time has passed
 * - If the cancellation time has not passed, set a timeout to cancel the game after the cancellation time
 * - If the cancellation time has passed, immediately cancel the game and refund the bet
 * 
 * @param {string} gameId - The ID of the coinflip game to cancel
 */
const handleCancellation = (gameId) => {
    const game = coinflipGames[gameId];
    if(!game) return;
    if(config.games.games.coinflip.cancel) {
        // const creator = game.players[game.creator].user.userid;
        const cancelTime = game.time + config.games.games.coinflip.timer_cancel;

        if(cancelTime > Date.now()) {
            game.timeout = setTimeout(async () => {
                await CoinflipGame.update({canceled: 1}, { where: {id: gameId} });

                delete coinflipGames[gameId];
            }, cancelTime - Date.now());
        } else {
            CoinflipGame.update({canceled: 1}, {where: {id: gameId}}).then(async () => {
                // Refund the bet and update the balance
                
                delete coinflipGames[gameId];
            });
        }
    }
}

const getBets = () => {
    const bets = [];

    Object.keys(coinflipGames).forEach(bet => {
        let coinflipData = {};

        coinflipData.game = {
            server_seed_hashed: sha256(coinflipGames[bet].game.server_seed),
            nonce: bet
        };

        if(coinflipGames[bet].status == 1) {
            coinflipData.time = config.games.games.coinflip.timer_wait_start - time() + coinflipGames[bet].time
        } else if(coinflipGames[bet].status == 2) {
            coinflipData.game.block = coinflipGames[bet].game.block;
        } else if(coinflipGames[bet].status == 3) {
            coinflipData.winner = getWinner(bet);
            coinflipData.game.block = coinflipGames[bet].game.block;
        } else if (coinflipGames[bet].status == 4) {
            coinflipData.winner = getWinner(bet);
            coinflipData.game.server_seed = coinflipGames[bet].game.server_seed;
            coinflipData.game.public_seed = coinflipGames[bet].game.public_seed;
            coinflipData.game.block = coinflipGames[bet].game.block;
        }

        bets.push({
            status: coinflipGames[bet].status,
            coinflip: {
                id: bet,
                players: coinflipGames[bet].players,
                amount: coinflipGames[bet].amount,
                data: coinflipData
            }
        });
    });

    return bets;
}

module.exports = {
    loadHistory,
    createGame,
    joinGame,
    joinConfirm,
    continueGame,
    getWinner,
    coinflipGames,
    coinflipSecure,
    getBets,
    cancelGame
};
