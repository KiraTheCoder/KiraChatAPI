import { logger } from "@src/logger";
const activeUsers = {};

function socketFn(io) {
    io.on('connection', (socket) => {

        socket.onAny((eventName, ...args) => {
            logger.info(`socket incoming event ${JSON.stringify(eventName)}`, { __filename });
            // logger.info(args);
        });

        socket.onAnyOutgoing((eventName, ...args) => {
            logger.info(`socket out going event ${JSON.stringify(eventName)}`, { __filename });
            // logger.info(args);
        });

        activeUsers[(socket as any).userId] = socket.id;


        logger.info("Socket connected succesfully");
        logger.info(`active users :  ${JSON.stringify(activeUsers)}`)

        //////////////

        // emit all connected user
        io.emit("welcome", "welcome to socket app")

        // broadcast all except sender
        socket?.broadcast?.emit(`welcome`, `welcome Hey, ${socket.id} broadcast message`)

        // emit only  which current client
        socket.emit("my_socket_id", socket.id)


        socket.on('sendMessage', ({ recipientId, message }) => {
            const recipientSocketId = activeUsers[recipientId];
            if (recipientSocketId) {
                logger.info(JSON.stringify({ recipientId, message }))
                io.to(recipientSocketId).emit('receiveMessage', {
                    senderId: socket.userId,
                    message: message,
                });
            }
        });

        socket.on('disconnect', () => {
            delete activeUsers[socket.userId];
        });
    });
}


export { socketFn };
