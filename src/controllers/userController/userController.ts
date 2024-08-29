import { RequestHandler, NextFunction, Request, Response } from "express";
import {
  signUpAndLoginValidator, imageValidator
} from "@src/validation_schema";
import { logger } from "@src/logger";
import { UserModel } from "@src/models"
import { StatusCodes } from "http-status-codes";



//////////////////////////
const signUpOrLoginController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`Sign-up or login process started`, { __filename });

    // Validate the request body
    const { name, phoneNumber } = await signUpAndLoginValidator.validateAsync(req?.body);
    logger.info(`Validated details: ${JSON.stringify({ name, phoneNumber })}`, { __filename });

    // Find or create user
    const user = await UserModel.findOneAndUpdate(
      { phoneNumber },
      { $set: { name } },
      { new: true, upsert: true } // `upsert: true` creates a new document if none exist  s
    );

    logger.info(`User processed: ${JSON.stringify(user)}`, { __filename });

    // Create JWT token
    if (user._id) {
      (req as any).userId = user._id;
      next()
    } else {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "User not processed" });
    }
  } catch (error) {
    logger.error(`Exception occurred in signUpOrLoginController: ${JSON.stringify(error)}`, { __filename });
    return next(error);
  }
};


//////////////////////////
const setUserImageController: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info(`image upload`, { __filename });

    let image;
    if (req.file) {
      image = {
        data: req?.file.buffer.toString("base64"),
        contentType: req?.file.mimetype
      }
    }

    // logger.info(`details ${JSON.stringify(image)}`, { __filename });

    if (image) {
      await imageValidator.validateAsync(image);
      await UserModel.findByIdAndUpdate((req as any).userId, { $set: { image } })
      return res.status(StatusCodes.CREATED).json({ success: true, message: "image uploaded" })
    }
    else {
      return res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "image not provided" })
    }
  } catch (error) {
    logger.error(`exception occurred at setImageController : ${JSON.stringify(error)}`, { __filename });
    return next(error);
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


//////////////////////////  





export { signUpOrLoginController, setUserImageController, getUserDataController };


