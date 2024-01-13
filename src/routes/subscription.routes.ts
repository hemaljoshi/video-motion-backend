import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller";

const router = Router();

router.route("/c/:channelId").post(toggleSubscription);

router.route("/u/:channelId").get(getUserChannelSubscribers);

router.route("/:subscriberId").get(getSubscribedChannels);

export default router;
