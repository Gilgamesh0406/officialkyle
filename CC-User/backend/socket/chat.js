const { checkMessage } = require('../services/chatService');

module.exports = async (socket, io, request) => {
    const { type, command, id } = request;
    const user = socket.user;
    console.log(request);

    if(type == "chat") {
        const { message, channel } = request;

        if(command == "get_channel") {

        }

        if(command == "message") {
            await checkMessage(user, io, socket, message, channel);
        }

        if(command == "send_coins") {

        }
    }
}