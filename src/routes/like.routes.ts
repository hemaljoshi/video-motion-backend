import { Router } from "express";
import {
  getCommentLikesCount,
  getLikedVideos,
  getTweetLikesCount,
  getVideoLikesCount,
  toggleCommentLike,
  toggleTweetLike,
  toggleVideoLike,
} from "../controllers/like.controller";
import { verifyJwtToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJwtToken);

router.route("/toggle/c/:commentId").post(toggleCommentLike);

router.route("/toggle/t/:tweetId").post(toggleTweetLike);

router.route("/toggle/v/:videoId").post(toggleVideoLike);

router.route("/count/v/:videoId").get(getVideoLikesCount);

router.route("/count/t/:tweetId").get(getTweetLikesCount);

router.route("/count/c/:commentId").get(getCommentLikesCount);

router.route("/videos").get(getLikedVideos);

export default router;
