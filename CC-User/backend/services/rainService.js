const { time } = require('steam-totp');
const config = require('../config');
const RainHistory = require('../models/RainHistory');
const RainTips = require('../models/RainTips');
const RainBets = require('../models/RainBets');

const { getFormatAmountString, getFormatAmount, getRandomInt } = require('../utils/helpers');
const { verifyFormatAmount } = require('../utils/site');
const { editBalance, updateBalance } = require('./bettingService');
const { otherMessages } = require('./chatService');

const rainGame = {
    status: "wait",
    amount: 0,
    lastTicket: 0,
    id: 0,
    timeout: null
}

let userBets = {};
let userWinnings = {}


const tipGame = (user, socket, amount) => {
    if(rainGame.status != "wait") {
        socket.emit('message', {
			type: 'error',
			error: 'Error: You can only tip coins to rain until starts!'
		});
    }

    verifyFormatAmount(amount, (err, amount) => {
        if(err) {
            socket.emit('message', {
				type: 'error',
				error: err.message
			});
        } else {
            const { min, max } = config.rewards.interval_amount.tip_rain;
            const textMessage = `${user.name} successfully tip ${getFormatAmountString(amount)} coins to rain.`;

            if(amount < min || amount > max) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: Invalid tip rain amount [' + getFormatAmountString(min) + '-' + getFormatAmountString(max)  + ']!'
                });
                return;
            }

            if(getFormatAmount(user.balance) < amount) {
                socket.emit('message', {
                    type: 'error',
                    error: 'Error: You don\'t have enough money!'
                });

                socket.emit('message', {
                    type: 'modal',
                    modal: 'insufficient_balance',
                    data: {
                        amount: getFormatAmount(amount - user.balance)
                    }
                });

                return;
            }

            editBalance(user.userid, -amount, 'rain_tip', (err) => {
                RainHistory.update({
                    amount: amount
                }, {
                    where: {
                        id: rainGame.id
                    }
                });

                rainGame.amount += amount;

                RainTips.create({
                    userid: user.userid,
                    amount: amount,
                });

                updateBalance(user.userid);

                socket.emit('message', {
                    type: 'success',
                    success: `You successfully tip ${getFormatAmountString(amount)} coins to rain.`
                });
            });
        }
    });
}

const rollGame = (io) => {
    RainHistory.update({
        time_roll: time()
    }, {
        where: {
            id: rainGame.id
        }
    });

    rainGame.status = "started";

    io.sockets.emit('message', {
        type: 'rain',
        command: 'started'
    });

    setTimeout(() => {
        rainGame.status = 'picking';

        for(let i =0;i < Math.floor(rainGame.amount * 100); i++) {
            const winningTicket = getRandomInt(1, rainGame.lastTicket);

            for(const betKey in userBets) {
                const { tickets } = userBets[betKey];

                if(winningTicket >= tickets.min && winningTicket <= tickets.max) {
                    userWinnings[betKey] = (userWinnings[betKey] || 0) + 1;
                }
            }
        }

        io.sockets.emit('message', {
            type: 'rain',
            command: 'waiting'
        });

        for(const bet in userBets) {
            io.sockets.in(bet).emit('message', {
                type: 'rain',
                command: 'joined'
            });
        }

        setTimeout(() => {
            rainGame.status = "ended";

            RainHistory.update({
                ended: 1
            }, {
                where: {
                    id: rainGame.id
                }
            });

            io.sockets.emit('message', {
                type: 'rain',
                command: 'ended'
            });

            if(Object.keys(userBets).length > 0) {
                const textMessage = Object.keys(userBets).length + ' users have sent a total of ' + getFormatAmountString(rainGame.amount) + ' coins.';
                otherMessages(textMessage, io.sockets, false);
            }

            for(const bet in userWinnings) {
                const amount = getFormatAmount(userWinnings[bet] * 0.01);

                editBalance(bet, amount, 'rain_win', (err) => {
                    updateBalance(bet);

                    RainBets.update({
                        winning: amount
                    }, {
                        where: {
                            id: userBets[bet].id
                        }
                    });

                    const textMessage = 'Congratulations! You have receive ' + getFormatAmountString(amount) + ' coins from rain.';

                    otherMessages(textMessage, io.sockets.in(bet), false);
                });
            }

            setTimeout(() => {
                userBets = {};
                userWinnings = {};
            }, 10 * 1000);
        }, 10 * 1000);

    }, config.rewards.rain.cooldown_start * 1000);
}

module.exports = {
    rainGame,
    tipGame,
    rollGame
}