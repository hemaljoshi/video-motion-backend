import { Router } from "express";
import { addTweet, deleteTweet, getAllTweet, updateTweet } from "../controllers/tweet.controller";

const router = Router();

router.route("/add-tweet").post(addTweet);

router.route("/").get(getAllTweet);

router.route("/update-tweet/:id").patch(updateTweet);

router.route("/delete-tweet/:id").delete(deleteTweet);

export default router;