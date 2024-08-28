import { RequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "@src/logger";
import { singleUserChatModel, groupChatModel } from "@src/models"
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
            res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Chat history not found" })
        }
        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "user Chat fetched successfully", data: { messages: userChat?.messages } })
    } catch (error) {
        logger.error(`exception occurred at getUserDataController : ${JSON.stringify(error)}`, { __filename });
        next(error)
    }
}

const groupChatGetController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("getting user Chat", { __filename })
        let userID = (req as any).userId
        let roomId = req?.body.roomId;

        if (!roomId) { return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "roomId not found" }) }

        userID = new ObjectId(userID)
        roomId = new ObjectId(roomId)

        const userChat: any = await groupChatModel.findOne({ roomId, $or: [{ userID }, { roomId }] }).select({ "_id": 0, "__v": 0, }).lean()

        if (!userChat) {
            return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Chat history not found" })
        }
        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "user Chat fetched successfully", data: { messages: userChat?.messages } })
    } catch (error) {
        logger.error(`exception occurred at getUserDataController : ${JSON.stringify(error)}`, { __filename });
        next(error)
    }
}

//////////////////////////  

export { singleUserChatGetController, groupChatGetController };


