const inventoryService = require('../services/inventoryService');
const { updateBalance, editBalance } = require('../services/bettingService');
module.exports = async (socket, io, request) => {
    const { type, command } = request;
    const user = socket.user;
    if(!user) {
        socket.emit('message', {
            type: 'error',
            error: 'You are not logged in!'
        });
        return;
    }
    if(type == 'inventory') {
        if(command == 'sell_item') {           
            const response = await inventoryService.sellItem(user.userid, request.id, socket);

            if(response !== null) {
                socket.emit('message', {
                    type: 'inventory',
                    command: 'sell_item',
                    ...response
                });

                socket.emit('message', {
                    type: 'success',
                    success: 'Item successfully sold!'
                });

                await updateBalance(user.userid, io);
            }
        }

        if(command == 'sell_all') {
            const response = await inventoryService.sellAllItems(user.userid, io);
            if(response !== null) {                
                socket.emit('message', {
                    type: 'inventory',
                    command: 'sell_items',
                    ...response
                });

                socket.emit('message', {
                    type: 'success',
                    success: 'All items successfully sold!'
                });

                await updateBalance(user.userid, io);
            }
        }
    }

    if(type == 'pagination') {
        const { page } = request;

        if(command == 'inventory_items') {
            const response = await inventoryService.getInventoryItems(socket, user.userid, page);

            socket.emit('message', {
                type: 'pagination',
                command: 'inventory_items',
                ...response
            });
        }
    }
}