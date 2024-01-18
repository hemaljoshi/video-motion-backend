import { Router } from "express";
import {
  getSubscribedChannels,
  getUserChannelSubscribers,
  toggleSubscription,
} from "../controllers/subscription.controller";
import { verifyJwtToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJwtToken);

/**
 * @swagger
 * /api/v1/subscription/c/{channelId}:
 *   post:
 *     summary: Subscribe to a channel
 *     tags: 
 *       - Subscription
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: Id of the channel to subscribe to
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successfully subscribed to the channel
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 subscriber: "65a5dcabbd2d602c1269fa4a"
 *                 channel: "65a2980900705e93991a7f4e"
 *                 _id: "65a8953b09393c33f5fc36d7"
 *                 createdAt: "2024-01-18T03:04:27.842Z"
 *                 updatedAt: "2024-01-18T03:04:27.842Z"
 *                 __v: 0
 *               message: Successfully subscribed
 *               success: true
 *       '404':
 *         description: Channel not found
 */

router.route("/c/:channelId").post(toggleSubscription);

/**
 * @swagger
 * /api/v1/subscription/u/{channelId}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Get subscribers for a channel
 *     description: Get subscribers for a channel
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: Id of the channel to get subscribers
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subscribers fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 - _id: "{{randomId}}"
 *                   subscriber:
 *                     _id: "{{subscriberId}}"
 *                     username: "{{username}}"
 *                     fullname: "{{fullname}}"
 *                     avatar: "{{avatarUrl}}"
 *                   channel: "{{channelId}}"
 *                   createdAt: "{{createdAt}}"
 *                   updatedAt: "{{updatedAt}}"
 *                   __v: 0
 *               message: "Subscribers fetched successfully"
 *               success: true
 */

router.route("/u/:channelId").get(getUserChannelSubscribers);

/**
 * @swagger
 * /api/v1/subscription/{subscriberId}:
 *   get:
 *     tags:
 *       - Subscription
 *     summary: Get subscribed channels of subscriber
 *     description: Get subscribed channels of subscriber
 *     parameters:
 *       - in: path
 *         name: subscriberId
 *         required: true
 *         description: ID of the subscriber
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Channels fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 - _id: "{{randomId}}"
 *                   subscriber: "{{subscriberId}}"
 *                   channel:
 *                     _id: "{{channelId}}"
 *                     username: "{{username}}"
 *                     fullname: "{{fullname}}"
 *                     avatar: "{{avatarUrl}}"
 *                   createdAt: "{{createdAt}}"
 *                   updatedAt: "{{updatedAt}}"
 *                   __v: 0
 *               message: "Channels fetched successfully"
 *               success: true
 */

router.route("/:subscriberId").get(getSubscribedChannels);

export default router;
