import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {uploadVideo} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router()

router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        }
    ]),
    uploadVideo
);

export default router;
