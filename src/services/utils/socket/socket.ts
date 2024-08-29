import { logger } from "@src/logger";
import { singleUserSocket } from "@src/services/utils/socket/singleUserSocket";
// import { groupSocket } from "./groupChat";

const activeUsers = {};

function socketFn(io) {
  io.on("connection", (socket) => {
    socket.onAny((eventName) =>
      logger.info(`socket incoming event ${JSON.stringify(eventName)}`, { __filename })
    );

    socket.onAnyOutgoing((eventName) => logger.info(`socket out going event ${JSON.stringify(eventName)}`, { __filename, }));

    const userId = (socket as any).userId
    activeUsers[userId] = socket.id;


    logger.info("Socket connected succesfully",{__filename});
    logger.info(`active users :  ${JSON.stringify(activeUsers)}`,{__filename});

    //////////////

    // emit all connected user
    io.emit("welcome", "welcome to Kira Chat App");

    // broadcast all except sender
    socket?.broadcast?.emit(
      `welcome`,
      `welcome Hey, ${socket.id} broadcast message`
    );

    // // emit only  which current client
    socket.emit("my_socket_id", socket.id);

    /////////  single user chatting /////////////
    singleUserSocket(io, socket, activeUsers, userId);

    /////////   group chatting /////////////
    // groupSocket(io, socket, activeUsers, userId);

    socket.on("disconnect", () => {
      delete activeUsers[socket.userId];
    });
  });
}

export { socketFn };
