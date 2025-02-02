import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js"
import {deleteVideo, getVideo, listVideos, updateVideo, uploadVideo} from "../controllers/video.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router()

router.route("/upload").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name:"thumbnail",
            maxCount:1
        }
    ]),
    uploadVideo
);

router.route("/v/:videoId").post(
    verifyJWT,
    deleteVideo
)

router.route("/v/:videoId").get(
    getVideo
)

router.route("/v/:videoId").patch(
    verifyJWT,
    updateVideo
)

router.route("/v/list").get(
    listVideos
)


export default router;
