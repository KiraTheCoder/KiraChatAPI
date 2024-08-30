import { Router } from "express";
import {
    groupChatCreateController, setGroupImageController, groupChatGetController,
    getGroupChatsController
} from "@src/controllers"
import { upload } from "@src/services/lib/multer"

const router = Router()

router.route("/")
    .get(groupChatGetController)

router.route("/create")
    .post(groupChatCreateController)

router.route("/upload_image")
    .post(upload.single("image"), setGroupImageController)

router.route("/details")
    .get(getGroupChatsController)

export { router as groupChatRoute }