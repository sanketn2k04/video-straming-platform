import {Router} from "express";
import {
    subscribe,
    getAllSubscribedChannel
} from "../controllers/subscription.controller.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"

const router=Router();

router.route("/c/channel/subscribe").post(
    verifyJWT,
    subscribe
);
router.route("/c/channel/subscribed-channels").get(
    verifyJWT,
    getAllSubscribedChannel
);

export default router;