import { Router } from "express";
import {
  getChannelStats,
  getChannelVideos,
} from "../controllers/dashboard.controller";
import { verifyJwtToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJwtToken);

/**
 * @swagger
 * /api/v1/dashboard/stats/{channelId}:
 *   get:
 *     summary: Get channel stats
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: Id of the channel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved channel stats
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 totalVideos: 0
 *                 totalSubscribers: 0
 *                 totalLikes: 0
 *                 totalViews: 0
 *                 totalComments: 0
 *               message: "Channel stats fetched successfully"
 *               success: true
 *       400:
 *         description: Channel ID is required
 */

router.route("/stats/:channelId").get(getChannelStats);

/**
 * @swagger
 * /api/v1/dashboard/videos/{channelId}:
 *   get:
 *     summary: Get channel videos
 *     tags:
 *       - Dashboard
 *     parameters:
 *       - in: path
 *         name: channelId
 *         required: true
 *         description: Id of the channel
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved channel videos
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 videos: 
 *                   - _id: "{{videoId}}"
 *                     videoFile: "{{videoFileUrl}}"
 *                     thumbnail: "{{thumbnailUrl}}"
 *                     title: "{{videoTitle}}"
 *                     description: "{{videoDescription}}"
 *                     duration: "{{videoDuration}}"
 *                     views: "{{videoViews}}"
 *                     isPublished: "{{isPublished}}"
 *                     owner: "{{ownerId}}"
 *                     createdAt: "{{createdAt}}"
 *                     updatedAt: "{{updatedAt}}"
 *                     __v: 0
 *               message: "Channel videos fetched successfully"
 *               success: true
 *       404:
 *         description: Channel not found
 */

router.route("/videos/:channelId").get(getChannelVideos);

export default router;
