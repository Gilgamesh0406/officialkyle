const {
    getCases,
    getCaseDetails,
    generateSpinner,
    openCase
} = require('../services/dailyCaseService');
const { calculateLevel, getFormatAmount, getFormatAmountString, roundedToFixed } = require('../utils/helpers');

const config = require('../config');
const { dailycases } = require('../config/reward');

module.exports = async(socket, io, request) => {
    const { type, command } = request;
    const user = socket.user;

    if(type == 'dailycases') {
        if(command == 'cases') {
            const cases = await getCases(user.userid);

            socket.emit('message', {
                type: 'dailycases',
                command: 'cases',
                cases: cases,
                level: calculateLevel(user.xp).level
            });
        }
        if(command == 'get') {
            const { id } = request;

            const caseDetails = await getCaseDetails(socket, id);

            socket.emit('message', {
                type: 'dailycases',
                command: 'show',
                items: caseDetails.items,
                dailycase: {
                    id,
                    name: caseDetails.name,
                    image: caseDetails.image,
                    level: caseDetails.level
                },
                level: calculateLevel(user.xp).level,
                spinner: generateSpinner(caseDetails.items)
            });
        }
        if(command == 'open') {
            const { id } = request;

            const winningItem = await openCase(socket, user, id);
            if(winningItem == -1) {
                socket.emit('message', {
                    type: 'error',
                    error: `Error: You already opened this daily case in the last ${config.rewards.dailycases.time} hours!`
                });
            } else {
                socket.emit('message', {
                    type: 'dailycases',
                    command: 'roll',
                    items: generateSpinner([winningItem]),
                    dailycase: {
                        id,
                        level: calculateLevel(user.xp).level,
                        time: config.rewards.dailycases.time * 60 * 60
                    }
                });

                setTimeout(() => {
                    socket.emit('message', {
                        type: 'dailycases',
                        command: 'finish'
                    });

                    console.log(`[DAILY CASES] Win registed ${user.name} did win $${getFormatAmountString(getFormatAmount(winningItem.price))} with chance ${roundedToFixed(winningItem.chance, 2).toFixed(2)}%`);

                    io.sockets.in('dailycases').emit('message', {
                        type: 'dailycases',
                        command: 'history'
                    })
                }, 5000);
                // console.log(`[DAILY CASE] Bet registed ${user.name} did open a daily case level ${dailycases[id].level}`);
            }
        }
    }
}