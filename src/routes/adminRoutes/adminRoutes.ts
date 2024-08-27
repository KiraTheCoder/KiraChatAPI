import { Router } from "express"
import { deleteAllUserController, } from "@src/controllers"
const router = Router()

router.route("/users")
    .delete(deleteAllUserController)

export { router as adminRoutes }