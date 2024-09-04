import express from "express";
import {
    sendSignUpOTPRoute, signUpOrloginRoute,
    userDataRoute, imageUploadRoute, chatRoute
} from "@src/routes/userRoutes"

import { getAllUsersController } from "@src/controllers"

import { verifyToken } from "@src/middlewares"

// router
const router = express.Router();

/////////////// routes for user  ///////////////

// signup login 
router.use("/send_otp", sendSignUpOTPRoute)
router.use("/signup_login", signUpOrloginRoute)
router.use("/upload_image", imageUploadRoute)
router.route("/all")
    .get(verifyToken, getAllUsersController)

// get user Data 
router.use("/details", userDataRoute)
router.use("/chat", verifyToken, chatRoute)


export { router as userRoute };