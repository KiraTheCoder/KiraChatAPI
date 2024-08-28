import { logger } from "@src/logger";
import { groupChatModel } from "@src/models";

export function groupSocket(activeUsers, io, socket, userId) {

    socket.on('sendGroupMessage', async ({ roomId, message }) => {
        try {
            // Update group chat document with the new message
            await groupChatModel.findOneAndUpdate(
                { roomId, adminIds: userId }, // Ensure user is in adminIds or userIds
                {
                    $push: {
                        messages: {
                            userId,
                            message
                        }
                    }
                },
                { upsert: true, new: true } // Create a new document if not found
            );

            // Fetch the updated group chat document to get all userIds
            const groupChat = await groupChatModel.findOne({ roomId }).lean();
            if (!groupChat) {
                logger.warn(`Group chat with roomId ${roomId} not found`);
                return;
            }

            // Emit the message to all users in the group
            groupChat.userIds.forEach((memberId) => {
                const memberSocketId = activeUsers[memberId.toString()];
                if (memberSocketId) {
                    io.to(memberSocketId).emit('receiveGroupMessage', {
                        senderId: userId,
                        message,
                        roomId
                    });
                }
            });

            logger.info(`Group message sent from ${userId} in room ${roomId}: ${message}`);
        } catch (error) {
            logger.error(`Error during sendGroupMessage event: ${error}`, { __filename });
        }
    });
}
