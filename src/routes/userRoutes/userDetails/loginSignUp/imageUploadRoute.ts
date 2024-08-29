import { Router } from "express";
import { verifyToken } from "@src/middlewares"
import { upload } from "@src/services/lib/multer"
import { setUserImageController } from "@src/controllers/index"

const router = Router()
router.route("/")
    .post(verifyToken, upload.single("image"), setUserImageController)

export { router as imageUploadRoute }
