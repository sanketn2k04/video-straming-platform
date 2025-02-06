import {Router} from "express";
import {
    createComment,
    updateComment,
    deleteComment,
    getCommentsByVideoId
} from "../controllers/comment.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"


const router=Router();

router.route("/c/addComment").post(
    verifyJWT,
    createComment
);

router.route("/c/updateComment").patch(
    verifyJWT,
    updateComment
);

router.route("/c/deleteComment").post(
    verifyJWT,
    deleteComment
)

router.route("/c/allComments").get(
    verifyJWT,
    getCommentsByVideoId
)

export default router;