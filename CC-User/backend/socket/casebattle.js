const {
    gameShow,
    getFinishedBattles,
    getMyBattles,
    loadCases,
    cerateCaseBattle,
    joinCaseBattle,
    leaveCaseBattle,
    sendEmoji
} = require('../services/caseBattleService');

module.exports = async (socket, io, request) => {
    const { type, command } = request;
    const user = socket.user;

    if(type == 'casebattle') {
        if(command == 'show') {
            await gameShow(user, socket, request.id);
        }

        if(command == 'finished') {
            await getFinishedBattles(user, socket, io);
        }

        if(command == 'my') {
            await getMyBattles(user, socket, io);
        }

        if(command == 'cases') {
            await loadCases(socket);
        }

        if(command == 'create') {
            const { cases, mode, privacy, free, crazy } = request;

            await cerateCaseBattle(user, socket, cases, mode, privacy, free, crazy, io);
        }

        if(command == 'join') {
            const { id, position } = request;
            await joinCaseBattle(user, socket, id, position, io);
        }

        if(command == 'emoji') {
            const { id, emoji, position } = request;

            await sendEmoji(user, socket, id, position, emoji, io);
        }
        if(command == 'leave') {
            const { id, position } = request;

            await leaveCaseBattle(user, socket, id, position, io);
        }
    }
}