import { RequestHandler, NextFunction, Request, Response } from "express";
import {
  signUpAndLoginValidator, imageValidator
} from "@src/validation_schema";
import { logger } from "@src/logger";
import { UserModel } from "@src/models"
import { StatusCodes } from "http-status-codes";
import { Types } from "mongoose";

const { ObjectId } = Types

//////////////////////////
const signUpOrLoginController: RequestHandler = async (req, res, next) => {
  try {
    logger.info("Sign-up or login process started", { __filename });

    const { name, phoneNumber } = await signUpAndLoginValidator.validateAsync(req.body);
    logger.info(`Validated details: ${JSON.stringify({ name, phoneNumber })}`, { __filename });

    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { $set: { name } },
      { new: true, upsert: true }
    );

    if (user && user._id) {
      logger.info(`User processed: ${JSON.stringify(user)}`, { __filename });
      (req as any).userId = user._id;
      return next();
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "User not processed",
      });
    }
  } catch (error) {
    logger.error(`Exception occurred in signUpOrLoginController: ${JSON.stringify(error)}`, { __filename });
    next(error);
  }
};



//////////////////////////
const setUserImageController: RequestHandler = async (req, res, next) => {
  try {
    logger.info("Image upload started", { __filename });

    const image = req.file
      ? {
        data: req.file.buffer.toString("base64"),
        contentType: req.file.mimetype,
      }
      : null;

    if (image) {
      await imageValidator.validateAsync(image);
    }

    await UserModel.findByIdAndUpdate((req as any).userId, { image });
    const message = image ? "Image uploaded" : "Image removed";

    return res.status(StatusCodes.CREATED).json({ success: true, message });
  } catch (error) {
    logger.error(`Exception occurred in setUserImageController: ${JSON.stringify(error)}`, { __filename });
    next(error);
  }
};



//////////////////////////
const getUserDataController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("getting user Data", { __filename })

    const friendUserId = req?.body?.userId;
    const currentUserID = (req as any).userId

    // get user data based on passed userId 
    let userData;
    if (friendUserId) {
      userData = await UserModel.findById(friendUserId).select({ "__v": 0, }).lean()
    }
    else {
      userData = await UserModel.findById(currentUserID).select({ "__v": 0, }).lean()
    }


    if (!userData) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "user not found" })
    }
    res.status(StatusCodes.ACCEPTED).json({ success: true, message: "user data fetched successfully", data: { ...userData } })
  } catch (error) {
    logger.error(`exception occurred at getUserDataController : ${JSON.stringify(error)}`, { __filename });
    next(error)
  }
}


const getAllUsersController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("getting users Data", { __filename })
    const userId = new ObjectId((req as any).userId)

    const userData = await UserModel.find({ _id: { $ne: userId } }).select({ "__v": 0, }).lean()

    if (!userData) {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "users not found" })
    }
    res.status(StatusCodes.ACCEPTED).json({ success: true, message: "users data fetched successfully", data: { users: userData, userId } })
  } catch (error) {
    logger.error(`exception occurred at getAllUsersController : ${JSON.stringify(error)}`, { __filename });
    next(error)
  }
}


//////////////////////////  
export { signUpOrLoginController, setUserImageController, getUserDataController, getAllUsersController };


