import { Router } from "express";
import {
    createGroupChatController, setGroupImageController, getGroupChatController,
    getGroupChatsController,getGroupChatHistoryRoute,deleteGroupChatController
} from "@src/controllers"
import { upload } from "@src/services/lib/multer"

const router = Router()

router.route("/")
    .get(getGroupChatController)
    .delete(deleteGroupChatController)

router.route("/create")
    .post(createGroupChatController)

router.route("/upload_image")
    .post(upload.single("image"), setGroupImageController)

router.route("/details")
    .get(getGroupChatsController)

router.route("/list")
    .get(getGroupChatHistoryRoute)



export { router as groupChatRoute }