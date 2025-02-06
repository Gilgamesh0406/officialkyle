const { regenerateServerSeed, changeClientSeed } = require('../services/fairService');

module.exports = async (socket, request) => {
    const user = socket.user;

    const { type, command } = request;

    if(type === 'fair') {

        if(command ==='save_clientseed') {
            const result = await changeClientSeed(user.userid, request.seed, request.recaptcha);

            socket.emit('message', {
                type: result.type,
                success: result.message
            });
        }

        if(command == 'regenerate_serverseed') {
            await regenerateServerSeed(user.userid, request.recaptcha, socket);
        }
    }
}