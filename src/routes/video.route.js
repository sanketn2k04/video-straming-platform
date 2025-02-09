import {Router} from "express";
import {upload} from "../middlewares/multer.middleware.js";
import {deleteVideo, 
    getVideo, 
    getVideoProfile, 
    listVideos, 
    updateVideo, 
    uploadVideo,
    likeVideo,
    dislikeVideo,
    incrementShares
} from "../controllers/video.controller.js";
import {verifyJWT} from "../middlewares/auth.middleware.js";
import {increaseViewsCount} from "../middlewares/views.middleware.js";

const router=Router();

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
);

router.route("/v/list").get(
    listVideos
);

router.route("/v/video/:videoId").get(
    increaseViewsCount,
    getVideo
);

router.route("/v/:videoId").patch(
    verifyJWT,
    updateVideo
);

router.route("/v/video-profile/:videoId").get(
    increaseViewsCount,
    getVideoProfile
);

router.route("/v/:videoId/like").post(
    verifyJWT,
    likeVideo
);

router.route("/v/:videoId/dislike").post(
    verifyJWT,
    dislikeVideo
);
router.route("/v/:videoId/share").post(
    incrementShares
);






export default router;
