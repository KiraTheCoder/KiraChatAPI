import express from "express";
import { upload } from "@src/services/lib/multer"
import { generateToken, verifyOtpMiddleware } from "@src/middlewares"
import { signUpOrLoginController } from "@src/controllers"


const router = express.Router();
router.route("/")
    .post(
        upload.single("image"),
        verifyOtpMiddleware,
        signUpOrLoginController,
        generateToken
    )
export { router as signUpOrloginRoute };
