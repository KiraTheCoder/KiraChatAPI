import { RequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "@src/logger";
import { singleUserChatModel, groupChatModel, userChatReferenceModel } from "@src/models"
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";
import { imageValidator } from "@src/validation_schema"

const { ObjectId } = Types;

//////////////////////////
const getSingleUserChatController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
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

const getGroupChatController: RequestHandler = async (req, res, next) => {
    try {
        logger.info("Getting user group chat", { __filename });

        const userId = new ObjectId((req as any).userId);
        const roomId = req.body.roomId ? new ObjectId(req.body.roomId) : null;

        if (!roomId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Room ID not found",
            });
        }

        const groupChat = await groupChatModel.findOne({
            roomId,
            $or: [
                { userIds: userId },
                { adminIds: userId },
            ],
        })
        .select("-_id -__v")
        .lean();

        if (!groupChat) {
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "Group chat not found",
            });
        }

        return res.status(StatusCodes.OK).json({
            success: true,
            message: "User chat fetched successfully",
            data: { messages: groupChat.messages },
        });
    } catch (error) {
        logger.error(`Exception occurred at getGroupChatController: ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
};


const deleteChatHistory: RequestHandler = async (req, res, next) => {
    try {
        logger.info("Deleting chat history...", { __filename });

        const currentUserId = new ObjectId((req as any).userId);
        const { friendUserId, roomId } = req.body;

        if (!friendUserId && !roomId) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Please provide friendUserId or roomId.",
            });
        }

        const updateFields = friendUserId
            ? { $pull: { friendsIds: new ObjectId(friendUserId) } }
            : { $pull: { groupIds: new ObjectId(roomId) } };

        const result = await userChatReferenceModel.findOneAndUpdate(
            { userId: currentUserId },
            updateFields,
            { new: true, runValidators: true }
        );

        if (!result) {
            logger.info(`No userChatReferenceModel found for userId: ${currentUserId}`, { __filename });
            return res.status(StatusCodes.NOT_FOUND).json({
                success: false,
                message: "User (friend or group) not found or chat history could not be deleted.",
            });
        }

        logger.info(`Chat history updated for userId: ${currentUserId}, result: ${JSON.stringify(result)}`, { __filename });
        return res.status(StatusCodes.OK).json({
            success: true,
            message: "Chat history deleted successfully, It's not deleted from DB.",
        });

    } catch (error) {
        logger.error(`Exception occurred at deleteChatHistory: ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
};



const createGroupChatController: RequestHandler = async (req, res, next) => {
    try {
        logger.info("creating group", { __filename });
        const userId = new ObjectId((req as any).userId);
        let { name, userIds } = req?.body;

        if (!name && !userIds) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "please provide name and userIds" });
        }

        userIds = userIds.map((id: string) => new ObjectId(id))
        await groupChatModel.create({
            adminIds: [userId],
            name,
            userIds
        })

        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "group created successfully" });
    } catch (error) {
        logger.error(`Exception occurred at createGroupChatController: ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
};


const setGroupImageController: RequestHandler = async (req, res, next) => {
    try {
        logger.info('image upload', { __filename });

        const userId = (req as any).userId;
        const image = req.file
            ? {
                data: req.file.buffer.toString('base64'),
                contentType: req.file.mimetype,
            }
            : null;

        if (image) {
            await imageValidator.validateAsync(image);
        }

        await groupChatModel.findByIdAndUpdate(userId, { $set: { image } });

        const message = image ? 'image uploaded' : 'image removed';
        return res.status(StatusCodes.CREATED).json({ success: true, message });

    } catch (error) {
        logger.error(`Exception at setGroupImageController: ${JSON.stringify(error)}`, { __filename });
        return next(error);
    }
};


const getGroupChatsController: RequestHandler = async (req, res, next) => {
    try {
        logger.info("getting group chats", { __filename });

        const userId = new ObjectId((req as any).userId);
        const roomId = req?.body?.roomId ? new ObjectId(req?.body?.roomId) : null;

        if (!roomId) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Please provide roomId." });
        }

        const groupChats = await groupChatModel
            .findOne({ roomId, $or: [{ userIds: userId }, { adminIds: userId }] })
            .lean();

        if (groupChats) {
            return res.status(StatusCodes.OK).json({
                success: true,
                message: "Group chats fetched successfully",
                data: { groupMessages: groupChats.messages },
            });
        }

        return res.status(StatusCodes.NOT_FOUND).json({
            success: false,
            message: "Group chat not found.",
        });

    } catch (error) {
        logger.error(`Exception occurred at getGroupChatsController: ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
};


//////////////////////////  

export {
    getSingleUserChatController, getGroupChatController,
    deleteChatHistory, createGroupChatController, setGroupImageController,
    getGroupChatsController
};


