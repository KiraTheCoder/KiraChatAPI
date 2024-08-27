import express from "express";
import {
    sendSignUpOTPRoute, signUpOrloginRoute,
    userDataRoute,imageUploadRoute,chatRoute
} from "@src/routes/userRoutes"


// router
const router = express.Router();

/////////////// routes for user  ///////////////

// signup login 
router.use("/send_otp", sendSignUpOTPRoute)
router.use("/signup_login", signUpOrloginRoute)
router.use("/upload_image", imageUploadRoute)

// get user Data 
router.use("/details", userDataRoute)
router.use("/chat", chatRoute)

export { router as userRoute };


