import { logger } from "@src/logger";
import { groupChatModel } from "@src/models";

export function groupSocket(io, socket, activeUsers, userId) {

    socket.on('sendGroupMessage', async ({ roomId, message }) => {
        try {
            const groupChat = await groupChatModel.findOne({
                roomId: roomId,
                $or: [
                    { userIds: userId },
                    { adminIds: userId }
                ]
            }).select({ "_id": 0, "__v": 0 }).lean();


            const groupMembers = [
                ...(groupChat?.userIds || []),
                ...(groupChat?.adminIds || [])
            ];
            
            groupMembers.forEach((memberId) => {
                const memberSocketId = activeUsers[memberId.toString()];
                if (memberSocketId) {
                    socket.broadcast.to(roomId).emit('receiveGroupMessage', {
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
