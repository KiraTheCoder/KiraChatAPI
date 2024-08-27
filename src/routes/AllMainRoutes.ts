import express from "express";
import { userRoute } from "@src/routes/userRoutes/userRoute"
import {adminRoutes} from "@src/routes/adminRoutes"


// router
const router = express.Router();

// admin
router.use("/admin",adminRoutes);
///////////////// user /////////////////
router.use("/user", userRoute)


export { router as AllMainRoutes };