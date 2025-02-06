const { placeBet } = require('../services/plinkoService');

module.exports = async (socket, io, request) => {
    const user = socket.user;

    const { type, command, amount, game } = request;

    if(type == 'plinko' && command == 'bet') {
        await placeBet(user, socket, io, amount, game, (cooldown, reset) => {
            // if(reset) plinkoCooldown[user.userid] = false;
            // if(cooldown) plinkoCooldown[user.userid] = true;
        });
    }
}