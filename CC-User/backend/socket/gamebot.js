const {
    showBotsForCoinflip,
    confirmBotForCoinflip,
    showBotsForCaseBattle,
    confirmBotForCaseBattle
} = require('../services/botService');

module.exports = async (socket, io, request) => {
    if(request.type == 'gamebots') {
        const { command, game, data, userid } = request;
    
        if(game == 'coinflip') {
            if(command == 'show') {
                const bots = await showBotsForCoinflip(socket, data.id);
        
                socket.emit('message', {
                    type: 'gamebots',
                    command: 'show',
                    bots,
                    game,
                    data
                });
            }
        
            if(command == 'confirm') {
                try {
                        const bot = await confirmBotForCoinflip(userid, socket, io, data.id);
        
                        socket.emit('message', {
                            type: 'success',
                            success: `${bot.name} successfully called in your coinflip!`
                        });
        
                        socket.emit('message', {
                            type: 'gamebots',
                            command: 'hide'
                        });
                    } catch(error) {
                        socket.emit('message', {
                            type: 'error',
                            error: error.message
                    });
                }
            }
        }

        if(game == 'casebattle') {
            if(command == 'show') {
                const { id, position } = data;
                const bots = await showBotsForCaseBattle(id, position, socket);
                socket.emit('message', {
                    type: 'gamebots',
                    command: 'show',
                    bots: bots,
                    game: 'casebattle',
                    data: request
                });
            }

            if(command == 'confirm') {
                console.log("[BOT] call confirm data", data)
                if(!data.data) {
                    // socket.emit('message', {
                    //     type: 'error',
                    //     error: 'Something went wrong!'
                    // })
                    return;
                }
                const { id, position } = data.data;
                const bot = await confirmBotForCaseBattle(userid, id, position, socket, io);

                socket.emit('message', {
                    type: 'success',
                    success: bot.name + ' successfully called in your casebattle!'
                });

                socket.emit('message', {
                    type: 'gamebots',
                    command: 'hide'
                });
            }
        }
    }
}