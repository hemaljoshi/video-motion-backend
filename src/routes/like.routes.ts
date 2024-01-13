import { Router } from "express";
import {
  getCommentLikesCount,
  getLikedVideos,
  getTweetLikesCount,
  getVideoLikesCount,
  toogleCommentLike,
  toogleTweetLike,
  toogleVideoLike,
} from "../controllers/like.controller";

const router = Router();

router.route("/toogle/c/:commentId").post(toogleCommentLike);

router.route("/toogle/t/:tweetId").post(toogleTweetLike);

router.route("/toogle/v/:videoId").post(toogleVideoLike);

router.route("/count/v/:videoId").get(getVideoLikesCount);

router.route("/count/t/:tweetId").get(getTweetLikesCount);

router.route("/count/c/:commentId").get(getCommentLikesCount);

router.route("/videos").get(getLikedVideos);

export default router;
