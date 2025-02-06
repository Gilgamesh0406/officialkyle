const coinflipService = require('../services/coinflipService');

module.exports = async (socket, io, request) => {
    if(request.type === 'coinflip') {
        const { command, amount, position } = request;
        const user = socket.user;

        if(command === 'create') {
            await coinflipService.createGame(user, socket, io, amount, position);

        } else if(request.command === 'join') {
            await coinflipService.joinGame(user, socket, io, request.id);

        } else if(request.command === 'remove') {
            await coinflipService.cancelGame(user, socket, io, request.id);
        } else {
            socket.emit('message', {
                type: 'error',
                error: 'Error: Invalid command!'
            })
        }
    }
};