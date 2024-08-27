import { RequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "@src/logger";
import { singleUserChatModel } from "@src/models"
import { StatusCodes } from "http-status-codes";

//////////////////////////
const singleUserChatController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        logger.info("getting user Chat", { __filename })
        const otherUserId = req?.body?.otherUserId;
        const userID = (req as any).userId
        const userChat = await singleUserChatModel.findOne({ chatId: { $all: [otherUserId, userID] } }).select({ "_id": 0, "__v": 0, }).lean()

        if (!userChat) {
            res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "Chat history not found" })
        }
        res.status(StatusCodes.ACCEPTED).json({ success: true, message: "user Chat fetched successfully", data: { messages: userChat?.messages } })
    } catch (error) {
        logger.error(`exception occurred at getUserDataController : ${JSON.stringify(error)}`, { __filename });
        next(error)
    }
}

//////////////////////////  

export { singleUserChatController };


