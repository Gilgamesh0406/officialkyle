const { Op } = require('sequelize');
const { UserItems, ItemsList } = require('../models');

const UserItemsTransactions = require('../models/UserItemsTransactions');

const { getFormatAmount, getColorByQuality, time } = require('../utils/helpers');
const { updateBalance, editBalance } = require('../services/bettingService');

const getInventoryItems = async (socket, userId, page) => {
    if(isNaN(Number(page)))
        throw new Error('Invalid page number!');

    page = parseInt(page);
    const offset = (page - 1) * 100;
    const limit = 100;

    const items = await UserItems.findAll({
        where: { userid: userId, status: 0 },
        include: [{ model: ItemsList, as: 'itemDetails', attributes: ['price', 'name', 'image', 'quality'] }],
        order: [['id', 'DESC']],
        offset,
        limit
    });

    const totalItems = await UserItems.count({
        where: { userid: userId, status: 0 }
    });

    const pages = Math.ceil(totalItems / 100);

    if(pages <= 0)
        socket.emit('message', {
            type: 'pagination',
            command: 'inventory_items',
            list: [],
            pages: 1,
            page: 1
        });

    const list = items
        .filter(item => item.itemDetails !== null)
        .map(item => ({
                item: {
                id: item.id,
                name: item.itemDetails.name,
                image: item.itemDetails.image,
                price: getFormatAmount(item.itemDetails.price),
                color: getColorByQuality(item.itemDetails.quality)
            }
        }));

    const inventoryValue = items.reduce((acc, val) => acc + parseFloat(val.itemDetails.price), 0);

    return {
        list,
        pages,
        page,
        inventory: {
            value: getFormatAmount(inventoryValue),
            count: totalItems
        }
    }
}

const sellItem = async (userId, itemId, socket) => {
    if(isNaN(Number(itemId)))
        throw new Error('Invalid item!');

    itemId = parseInt(itemId);

    const userItem = await UserItems.findOne({
        where: { id: itemId, userid: userId, status: 0 },
        include: [{ model: ItemsList, as: 'itemDetails', attributes: ['price'] }]
    });

    if(!userItem) {
        socket.emit('message', {
            type: 'error',
            error: 'Invalid item. Item not found!'
        });
        return null;
    }

    const amount = getFormatAmount(userItem.itemDetails.price);

    await UserItems.update(
        { status: 1 },
        { where: {
            id: itemId,
            userid: userId,
            status: 0
        }
    });

    await UserItemsTransactions.create({
        userid: userId,
        service: 'sell_item',
        amount: -amount,
        itemid: itemId,
        time: time()
    });

    await editBalance(userId, amount, 'sell_item', (err) => {});

    const remainingItems = await UserItems.findAll({
        where: { userid: userId, status: 0 },
        include: [{ model: ItemsList, as: 'itemDetails', attributes: ['price'] }]
    });

    const inventoryValue = remainingItems.reduce((acc, val) => acc + parseFloat(val.itemDetails.price), 0);

    return {
        id: itemId,
        inventory: {
            value: getFormatAmount(inventoryValue),
            count: remainingItems.length
        }
    }
}

const sellAllItems = async (userId, io) => {
    const items = await UserItems.findAll({
        where: { userid: userId, status: 0 },
        include: [{ model: ItemsList, as: 'itemDetails', attributes: ['price'] }]
    });

    if(items.length <= 0) {
        io.sockets.in(userId).emit('message', {
            type: 'error',
            error: 'No available items in inventory!'
        });
        return null;
        // throw new Error('No available items in inventory!');
    }

    const itemsToSell = [];
    const totalAmount = items.reduce((acc, item) => {
        itemsToSell.push(item.id);
        return acc + parseFloat(item.itemDetails.price);
    }, 0);

    await UserItems.update(
        { status: 1 },
        { where:
            {
                id: { [Op.in]: itemsToSell},
                userid: userId,
                status: 0
            }
        });

    await Promise.all(itemsToSell.map(async (id, index) => {
        await UserItemsTransactions.create({
            userid: userId,
            service: 'sell_item',
            amount: -getFormatAmount(items[index].itemDetails.price),
            itemid: id,
            time: time()
        });
    }));

    await editBalance(userId, totalAmount, 'sell_items', (err) => {});

    return {
        ids: itemsToSell,
        inventory: {
            value: 0,
            count: 0
        }
    }
}

const sellAllGameItems = async (user, index, items, itemsSuccess, callback) => {
    if(index >= items.length) {
        return callback(null, itemsSuccess);
    }

    await UserItems.update(
        { status: 1 },
        { where:
            {
                id: items[index].id,
                userid: user.userid,
                status: 0
            }
        });

    await UserItemsTransactions.create({
        userid: user.userid,
        service: 'sell_item',
        amount: -getFormatAmount(items[index].price),
        itemid: items[index].id,
        time: time()
    });

    itemsSuccess.push(items[index]);

    sellAllGameItems(user, index + 1, items, itemsSuccess, callback);
}

module.exports = {
    getInventoryItems,
    sellItem,
    sellAllItems,
    sellAllGameItems
}