import { logger } from "@src/logger";
import { singleUserChatModel } from "@src/models";
import { Types } from "mongoose";
const { ObjectId } = Types;

export function singleUserSocket(io, socket, activeUsers, userId) {
  socket.on("sendMessage", async ({ recipientId, message }) => {
    try {
      logger.info(recipientId + "      "  +userId);
      // Update chat document with the new message
      const otherUserId = new ObjectId(recipientId);
      const MyUserId = new ObjectId(userId);
      await singleUserChatModel.findOneAndUpdate(
        { chatId: { $all: [otherUserId, MyUserId] } },
        {
          $push: {
            messages: {
              userId,
              message,
            },
          },
        },
        { upsert: true }
      );

      // Emit the message to the recipient if they are online
      const recipientSocketId = activeUsers[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", {
          senderId: userId,
          message,
        });
        logger.info(
          `Message sent from ${userId} to ${recipientId}: ${message}`
        );
      }
    } catch (error) {
      logger.error(`Error during sendMessage event: ${error}`, { __filename });
    }
  });
}
