import { RequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "@src/logger";
import { singleUserChatModel, groupChatModel, userChatReferenceModel } from "@src/models"
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { imageValidator } from "@src/validation_schema"

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


const deleteChatHistory: RequestHandler = async (req, res, next) => {
    try {
        logger.info("Deleting chat history...", { __filename });

        const currentUserId = new ObjectId((req as any).userId);
        const { friendUserId, roomId } = req.body;

        if (!friendUserId && !roomId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please provide friendUserId or roomId" });
        }


        let updateFields: any = {};
        if (friendUserId) {
            updateFields = { $pull: { friendsIds: new ObjectId(friendUserId) } };
        } else if (roomId) {
            updateFields = { $pull: { groupIds: new ObjectId(roomId) } };
        }

        const result = await userChatReferenceModel.findOneAndUpdate(
            { userId: friendUserId },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!result) {
            logger.info(`No userChatReferenceModel found for userId: ${currentUserId}`, { __filename });
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "User (friend OR group) not found or chat history could not be deleted" });
        }

        logger.info(`Chat history updated for userId: ${currentUserId}, result: ${JSON.stringify(result)}`, { __filename });
        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "Chat history deleted successfully, It's not deleted from DB" });
    } catch (error) {
        logger.error(`Exception occurred at deleteChatHistory: ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
};


const groupChatCreateController: RequestHandler = async (req, res, next) => {
    try {
        logger.info("creating group", { __filename });
        const userId = new ObjectId((req as any).userId);
        let { name, userIds } = req?.body;

        if (!name && !userIds) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "please provide name and userIds" });
        }

        userIds = userIds.map((id) => new ObjectId(id))
        await groupChatModel.create({
            adminIds: [userId],
            name: name,
            userIds
        })


        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "group created successfully" });
    } catch (error) {
        logger.error(`Exception occurred at deleteChatHistory: ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
};


const setGroupImageController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info(`image upload`, { __filename });
        let image;
        if (req.file) {
            image = {
                data: req?.file.buffer.toString("base64"),
                contentType: req?.file.mimetype
            }
        }
        if (image) {
            await imageValidator.validateAsync(image);
            await groupChatModel.findByIdAndUpdate((req as any).userId, { $set: { image } })
            return res.status(StatusCodes.CREATED).json({ success: true, message: "image uploaded" })
        }
        else {
            await groupChatModel.findByIdAndUpdate((req as any).userId, { $set: { image: null } })
            return res.status(StatusCodes.CREATED).json({ success: true, message: "image removed" })
        }
    } catch (error) {
        logger.error(`exception occurred at setImageController : ${JSON.stringify(error)}`, { __filename });
        return next(error);
    }
};


const getGroupChatsController: RequestHandler = async (req, res, next) => {
    try {
        logger.info("creating group", { __filename });
        await groupChatModel.find({})
        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "group created successfully" });
    } catch (error) {
        logger.error(`Exception occurred at deleteChatHistory: ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
};
//////////////////////////  

export { singleUserChatGetController, groupChatGetController, deleteChatHistory, groupChatCreateController, setGroupImageController, getGroupChatsController };


