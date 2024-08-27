import { Router } from "express";
import { sendOtpMiddleware } from "@src/middlewares"

const router = Router()
router.route("/")
    .post(sendOtpMiddleware)

export { router as sendSignUpOTPRoute }
