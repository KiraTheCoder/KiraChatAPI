import { RequestHandler, NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { sendOtp } from "@src/services/lib/otpLess"
import { logger } from "@src/logger"
import { OtpSendValidator } from "@src/validation_schema"
import { verifyOtp } from "@src/services/lib/otpLess"
import { VerifyOtpValidator } from "@src/validation_schema"

const sendOtpMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("Opt sending start..")

    const { phoneNumber } = await OtpSendValidator.validateAsync(req.body)
    let result;

    /// only allow indian number
    result = await sendOtp(`+91${phoneNumber}`, "WHATSAPP")
    // result = await sendOtp(phoneNumber, "SMS")

    if (result?.success) {
      logger.info("OTP send successfully")
      const otpID = (result?.message)?.startsWith("Otp") ? result?.message : false
      return res.status(StatusCodes.CREATED).json({ success: true, message: "OTP send succesfully", data: { otpID } });
    }
    else { return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "OTP not generated" }) }

  } catch (error) {
    logger.error(`exception occurred at ${JSON.stringify(error)}`, { __filename });
    next(error);
  }
};


const verifyOtpMiddleware: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info("OTP verifying starts", { __filename })
    const { phoneNumber, otp, otpID } = await VerifyOtpValidator.validateAsync({ phoneNumber: req?.body?.phoneNumber, otp: req?.body?.otp, otpID: req?.body?.otpID })
    // logger.info(`OTP verify Data: ${JSON.stringify({ phoneNumber, otp, otpID })}`, { __filename })

    let result;

    if (phoneNumber) {
      if (!otpID) {
        res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: "please provide OTP ID", data: {} })
      }

      // only allow indian number
      result = await verifyOtp(`+91${phoneNumber}`, otpID, otp)
    }
    ////////////////////
    if (result?.success) {
      logger.info(`${result?.message}`, { __filename })
      delete req.body.otp
      delete req.body.otpID
      return next()
    }
    else
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: "OTP not Verified" })
  } catch (error) {
    logger.error(`exception occurred at ${JSON.stringify(error)}`, { __filename });
    next(error);
  }
};

export { sendOtpMiddleware, verifyOtpMiddleware };
