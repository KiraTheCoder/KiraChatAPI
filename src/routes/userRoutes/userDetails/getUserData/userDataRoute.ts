import { Router } from "express";
import { getUserDataController } from "@src/controllers"
import { verifyToken } from "@src/middlewares";

const router = Router()
router.route("/")
    .get(verifyToken, getUserDataController)

export { router as userDataRoute }