import { logger } from "@src/logger";
import { singleUserChatModel } from "@src/models";

export function singleUserSocket(activeUsers, io, socket, userId) {

    socket.on('sendMessage', async ({ recipientId, message }) => {
        try {
            // Update chat document with the new message
            await singleUserChatModel.findOneAndUpdate(
                { chatId: { $all: [recipientId, userId] } },
                {
                    $push: {
                        messages: {
                            userId,
                            message,
                        }
                    }
                },
                { upsert: true }
            );

            // Emit the message to the recipient if they are online
            const recipientSocketId = activeUsers[recipientId];
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receiveMessage', {
                    senderId: userId,
                    message
                });
                logger.info(`Message sent from ${userId} to ${recipientId}: ${message}`);
            }
        } catch (error) {
            logger.error(`Error during sendMessage event: ${error}`, { __filename });
        }
    });
}
