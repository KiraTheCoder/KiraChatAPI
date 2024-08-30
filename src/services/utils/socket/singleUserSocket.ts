import { logger } from "@src/logger";
import { singleUserChatModel, userChatReferenceModel } from "@src/models";
import { Types } from "mongoose";
const { ObjectId } = Types;
import { timeDateFormat } from "@src/services/lib/moment"

export function singleUserSocket(io, socket, activeUsers, userId) {
  socket.on("sendMessage", async ({ recipientId, message }) => {
    try {
      const otherId = new ObjectId(recipientId);
      const myId = new ObjectId(userId);

      let singleUserChats = await singleUserChatModel.findOne({
        chatId: { $all: [otherId, myId] }
      }).lean();

      if (!singleUserChats) {
        // Create a new chat with exactly 2 IDs if not found
        try {
          singleUserChats = await singleUserChatModel.create({
            chatId: [otherId, myId],
            messages: []
          });
        } catch (error) {
          logger.error(`error while singleUserChatModel create docs ${JSON.stringify(error)}`, { __filename })
        }


        ///// create user chatting history
        //////////////////// create current user chatsReference docs //////////////////
        try {
          const userChatRef = await userChatReferenceModel.findById(myId).lean()
          if (!userChatRef) {
            try {
              await userChatReferenceModel.create({
                userId: myId,
                friendsIds: [otherId],
                groupIds: []
              })
            } catch (error) {
              logger.error(`error while currerent userChatReferenceModel create docs ${JSON.stringify(error)}`, { __filename })
            }
          }
          else {
            await userChatReferenceModel.findOneAndUpdate({ userId: myId }, { $addToSet: { friendsIds: otherId } })
          }

        } catch (error) {
          logger.error(`error while currerent userChatReferenceModel create docs ${JSON.stringify(error)}`, { __filename })
        }


        //////////////////// create other user chatsReference docs //////////////////
        try {
          const userChatRef = await userChatReferenceModel.findById(otherId).lean()
          if (!userChatRef) {
            try {
              await userChatReferenceModel.create({
                userId: otherId,
                friendsIds: [myId],
                groupIds: []
              })
            } catch (error) {
              logger.error(`error while other userChatReferenceModel create docs ${JSON.stringify(error)}`, { __filename })
            }
          }
          else {
            await userChatReferenceModel.findOneAndUpdate({ userId: otherId }, { $addToSet: { friendsIds: myId } })
          }

        } catch (error) {
          logger.error(`error while other userChatReferenceModel create docs ${JSON.stringify(error)}`, { __filename })
        }

      }

      // Push the new message into the messages array
      try {
        await singleUserChatModel.findOneAndUpdate(
          { _id: singleUserChats?._id },
          {
            $addToSet: {
              messages: {
                userId: new Types.ObjectId(userId),
                message,
                createdAt: timeDateFormat(new Date())
              }
            }
          },
          {
            runValidators: true
          }
        )
      } catch (error) {
        logger.error(`error while singleUserChatModel update docs ${JSON.stringify(error)}`, { __filename })

      }


      logger.info(`Message saved in DB --> ${userId} to ${recipientId}: ${message}`, { __filename });

      // Emit the message to the recipient if they are online
      const recipientSocketId = activeUsers[recipientId];
      if (recipientSocketId) {
        io.to(recipientSocketId).emit("receiveMessage", {
          userId: userId,
          message: message,
          createdAt: timeDateFormat(new Date())
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
