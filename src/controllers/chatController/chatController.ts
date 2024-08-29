import { RequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "@src/logger";
import { singleUserChatModel, groupChatModel, userChatReferenceModel } from "@src/models"
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

const { ObjectId } = Types;

//////////////////////////
const singleUserChatGetController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("getting user Chat", { __filename })

        let otherUserId = req?.body?.otherUserId
        let userID = (req as any).userId

        if (!otherUserId) { return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "otherUserId not found" }) }

        otherUserId = new ObjectId(otherUserId);
        userID = new ObjectId(userID)

        const userChat: any = await singleUserChatModel.findOne({ chatId: { $all: [otherUserId, userID] } }).select({ "_id": 0, "__v": 0, }).lean()

        if (!userChat) {
            res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "user chat not found" })
        }
        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "user Chat fetched successfully", data: { messages: userChat?.messages } })
    } catch (error) {
        logger.error(`exception occurred at singleUserChatGetController : ${JSON.stringify(error)}`, { __filename });
        next(error)
    }
}

const groupChatGetController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("getting user group Chat", { __filename })
        let userId = (req as any).userId
        let roomId = req?.body.roomId;

        if (!roomId) { return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "roomId not found" }) }

        userId = new ObjectId(userId)
        roomId = new ObjectId(roomId)

        const groupChat = await groupChatModel.findOne({
            roomId: roomId,
            $or: [
                { userIds: userId },
                { adminIds: userId }
            ]
        }).select({ "_id": 0, "__v": 0 }).lean();

        if (!groupChat) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "group chat not found" })
        }
        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "user Chat fetched successfully", data: { messages: groupChat?.messages } })
    } catch (error) {
        logger.error(`exception occurred at groupChatGetController : ${JSON.stringify(error)}`, { __filename });
        next(error)
    }
}


const deleteChatHistory: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("Deleting chat history...", { __filename });

        const currentUserId = new ObjectId((req as any).userId);
        let { friendUserId, roomId } = req.body;

        if (!friendUserId && !roomId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please provide friendUserId or roomId" });
        }

        let result;
        if (friendUserId) {
            friendUserId = new ObjectId(friendUserId);
            result = await userChatReferenceModel.findByIdAndUpdate(
                currentUserId,
                { $pull: { friendsIds: friendUserId } },
                { new: true }
            );
        } else if (roomId) {
            roomId = new ObjectId(roomId);
            result = await userChatReferenceModel.findByIdAndUpdate(
                currentUserId,
                { $pull: { groupIds: roomId } },
                { new: true }
            );
        }

        if (!result) {
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User (friend OR group) not found and chat history deleted" });
        }

        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "Chat history deleted successfully" });
    } catch (error) {
        logger.error(`Exception occurred at deleteChatHistory: ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
};




//////////////////////////  

export { singleUserChatGetController, groupChatGetController, deleteChatHistory };


