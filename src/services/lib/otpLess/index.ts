import { logger } from "@src/logger";
import { sendOTP, verifyOTP } from 'otpless-node-js-auth-sdk';

let clientId: string = process.env.OTPLESS_CLIENT_ID || ''
let secretId: string = process.env.OTPLESS_CLIENT_SECRET || ''
let otpExpiryTime: string = process.env.OTPLESS_EXPIRY_TIME || ''
let otpLength: string = process.env.OTPLESS_LENGTH || ''


async function sendOtp(phoneNumber, channel) {
    try {
        if (!clientId || !secretId || !otpExpiryTime || !otpLength) {
            logger.info("OTPLESS_CLIENT_ID OR OTPLESS_CLIENT_SECRET OR OTPLESS_EXPIRY_TIME OR OTPLESS_LENGTH may not in .env", { __filename })
        }
        const otpResponse = await sendOTP(phoneNumber, null, channel, null, null, Number(otpExpiryTime), otpLength, clientId, secretId);

        if ((otpResponse as Object).hasOwnProperty('success') && !otpResponse.success)
            return {
                success:false,
                message:'Server Error'
            }

            return {
                success:true,
                message:otpResponse.orderId
            }

    } catch (err) {
        logger.error(`Error while sending OTP`, { __filename });
        return {
            success:false,
            message: err
        }
    }

}

async function verifyOtp(phoneNumber,uniqueId,otp) {
    logger.info(`Verify OTP method starts`, { __filename });

    try {
        if (!clientId || !secretId || !otpExpiryTime || !otpLength) {
            logger.info("OTPLESS_CLIENT_ID OR OTPLESS_CLIENT_SECRET OR OTPLESS_EXPIRY_TIME OR OTPLESS_LENGTH may not in .env", { __filename })
        }

        const isValidOTP = await verifyOTP(null, phoneNumber, uniqueId, otp, clientId, secretId);

        if (isValidOTP && Object.keys(isValidOTP).length) {
            if (!isValidOTP.isOTPVerified) {
                logger.error(`Invalid OTP`, { __filename });
                return {
                    success:false,
                    message: `Invalid OTP`
                }
            }
        }

        return {
            success:true,
            message: 'OTP verified'
        }

    } catch (err) {
        logger.error(`Error while verifying OTP`, { __filename });
        return {
            success:false,
            message:err
        }
    }
}

export { sendOtp, verifyOtp }