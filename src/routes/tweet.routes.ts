import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweet,
  getUserTweet,
  updateTweet,
} from "../controllers/tweet.controller";

const router = Router();

router.route("/").get(getAllTweet).post(createTweet);

router.route("/user/:userId").get(getUserTweet);

router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;