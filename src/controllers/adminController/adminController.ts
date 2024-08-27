import { UserModel } from "@src/models"
import { RequestHandler, NextFunction, Request, Response } from "express";
import { logger } from "@src/logger";
import { StatusCodes } from "http-status-codes";


const deleteAllUserController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await UserModel.deleteMany({})
        return res.status(StatusCodes.ACCEPTED).json({ success: true, message: "All user Delete", data: {} })
    }
    catch (error) {
        logger.error(`exception occurred at deleteAllUserController : ${JSON.stringify(error)}`, { __filename });
        next(error);
    }
}

export { deleteAllUserController }