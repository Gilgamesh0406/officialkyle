const Sequelize = require('sequelize');
const Users = require('../models/Users');
const UserTransactions = require('../models/UserTransactions');
const UserItems = require('../models/UserItems');
const ItemsList = require('../models/ItemsList');
const UserItemsTransactions = require('../models/UserItemsTransactions');

const {
    calculateLevel,
    getFormatAmount,
    getFeeFromCommission,
    getXpByAmount,
    getFormatAmountString,
    time
} = require('../utils/helpers');

const config = require('../config');

const updateBalance = async (userid, io) => {
    try {
        const user =  await Users.findOne({where: {userid}});
        if(!user) return;

        const balance = parseFloat(user.balance).toFixed(2);

        io.sockets.in(userid).emit('message', {
            type: 'balance',
            balance
        });

    } catch(error) {
        console.error(error);
    }
}

const updateLevel = async (userid, io) => {
    try {
        const user = await Users.findOne({where: {userid}});
        if(!user) return;

        const level = calculateLevel(user.xp);

        io.sockets.in(userid).emit('message', {
            type: 'level',
            level
        });
    } catch(error) {
        console.log(error);
    }
}

const getBalance = async (userid, callback) => {
    try {
        const user = await Users.findOne({where: { userid }});

        if(!user)
            return callback(new Error('Unable to get the user balance'));

        const balance = getFormatAmount(user.balance);

        callback(null, balance);
    } catch(error) {
        console.error(error);
        callback(error);
    }
}

const registerBet = async (userid, amountremove, itemsid, game, check, io, callback) => {
        const allowedGames = ['roulette', 'crash', 'jackpot', 'coinflip', 'dice', 'unboxing', 'casebattle', 'upgrader', 'minesweeper', 'tower', 'plinko'];

        if(!allowedGames.includes(game))
            return callback(new Error('Unable to register your bet'));

        if(check) {
            const { min, max } = config.rewards.interval_amount[game];

            if(amountremove < min || amountremove > max) {
                return callback(new Error('Invalid bet amount [' + getFormatAmountString(min) + '-' + getFormatAmountString(max) + ']'));
            }
        }

        getBalance(userid, (err1, balance) => {
            if(err1)
                return callback(new Error('Unable to register your bet'));

            if(balance < amountremove) {
                io.sockets.in(userid).emit('message', {
                    type: 'modal',
                    modal: 'insufficient_balance',
                    data: {
                        amount: getFormatAmount(amountremove - balance)
                    }
                });

                return callback(new Error('You don\'t have enough money'));
            }

            editBalance(userid, -amountremove, `${game}_bet`, async (err) => {
                if(err) {
                    return callback(new Error('Unable to register your bet 3'));
                }

                removeItems(userid, itemsid, `${game}_bet`, (err) => {
                    if(err) {
                        return callback(new Error('Unable to register your bet 2'));
                    }
                    return callback(null);
                });
            });

        });
}

const finishBet = async (userid, amount, winning, amountadd, itemsid, game, callback) => {
    try {
        const games_allowed = ['roulette', 'crash', 'jackpot', 'coinflip', 'dice', 'unboxing', 'casebattle', 'upgrader', 'minesweeper', 'tower', 'plinko'];

        if (!games_allowed.includes(game))
            return callback(new Error('Unable to finish your bet'));

        amountadd = getFormatAmount(amountadd - getFeeFromCommission(amountadd, config.games.commissions[game]));

        editBalance(userid, amountadd, `${game}_win`, (err) => {
            if(err) {
                return callback(new Error('Unable to finish your bet 2'));
            }

            const available = Math.min(amount, winning - amount);
            const xp = getXpByAmount(amount);

            addItems(userid, itemsid, `${game}_win`, async (addItemErr, items) => {
                await Users.update(
                    {
                        available: Sequelize.literal(`available + ${available}`),
                        xp: Sequelize.literal(`xp + ${xp}`)
                    },
                    { where: { userid } }
                );

                callback(null, items);
            });
        });
    } catch (error) {
        console.error(error);
        callback(error);
    }
}

const editBalance = async (userid, amount, service, callback) => {
    await Users.update(
        { balance: Sequelize.literal(`balance + ${amount}`) },
        { where: { userid } }
    ).then(async () => {
        await UserTransactions.create({
            userid,
            service,
            amount,
            time: time()
        });

        callback(null);
    }).catch(err => {
        callback(err);
        console.error('edit balance error : ', err);
    });
}

const refundBet = async (userid, amount, game, callback) => {
    try {
        await editBalance(userid, amount, `${game}_refund`, (err) => {});
        callback(null);
    } catch(error) {
        console.error(error);
        callback(error);
    }
}

const addItems = async (userid, itemsid, service, callback) => {
    try {
        let items = [];

        for (const itemid of itemsid) {
            await UserItems.create({
                itemid,
                userid,
                time: time()
            }).then(async item => {
                const amount = getFormatAmount(item.price);

                await UserItemsTransactions.create({
                    userid,
                    service,
                    amount,
                    itemid: item.id,
                    time: parseInt(new Date().getTime() / 1000)
                });

                items.push({
                    id: item.id,
                    itemid: itemid,
                    price: amount,
                });
            });
        }

        callback(null, items);
    } catch (error) {
        console.error(error);
        callback(error);
    }
}

const removeItems = async (userid, itemsid, service, callback) => {
    try {
        for (const itemid of itemsid) {
            const item = await UserItems.findOne({
                where: {
                    id: itemid,
                    status: 0,
                    userid
                },
                include: [{
                    model: ItemsList,
                    attributes: ['price']
                }]
            });

            if (!item) throw new Error('Unable to remove user item');

            await UserItems.update(
                { status: 1 },
                { where: { id: itemid, status: 0, userid } }
            );

            const amount = getFormatAmount(item.price);
            await UserItemsTransactions.create({
                userid,
                service,
                amount: -amount,
                itemid,
                time: parseInt(new Date().getTime() / 1000)
            });
        }
        callback(null);
    } catch(error) {
        console.error(error);
    }
}

const handleDisconnect = (user) => {
    if(user && user.userid) {
        console.log(`[SERVER] User with userid ${user.userid} is disconnected`);
    }
};


module.exports = {
    handleDisconnect,
    updateBalance,
    getBalance,
    updateLevel,
    registerBet,
    finishBet,
    refundBet,
    editBalance
}