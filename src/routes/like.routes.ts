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

/**
 * @swagger
 * /api/v1/like/toggle/c/{commentId}:
 *   post:
 *     summary: Toggle like on a comment
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Id of the comment
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully liked the comment
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 201
 *               data:
 *                 comment: "{commentId}"
 *                 likedBy: "{userId}"
 *                 _id: "{likeId}"
 *                 createdAt: "{createdAt}"
 *                 updatedAt: "{updatedAt}"
 *                 __v: 0
 *               message: Successfully liked the comment.
 *               success: true
 *       400:
 *         description: Comment id is required
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Something went wrong while liking comment
 */

router.route("/toggle/c/:commentId").post(toggleCommentLike);

/**
 * @swagger
 * /api/v1/like/toggle/t/{tweetId}:
 *   post:
 *     summary: Toggle like on a tweet
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         required: true
 *         description: Id of the tweet
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully liked the tweet
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 201
 *               data:
 *                 tweet: "{tweetId}"
 *                 likedBy: "{userId}"
 *                 _id: "{likeId}"
 *                 createdAt: "{createdAt}"
 *                 updatedAt: "{updatedAt}"
 *                 __v: 0
 *               message: Successfully liked the tweet.
 *               success: true
 *       400:
 *         description: Tweet id is required
 *       404:
 *         description: Tweet not found
 *       500:
 *         description: Something went wrong while liking tweet
 */

router.route("/toggle/t/:tweetId").post(toggleTweetLike);

/**
 * @swagger
 * /api/v1/like/toggle/v/{videoId}:
 *   post:
 *     summary: Toggle like on a video
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: Id of the video
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successfully liked the video
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 201
 *               data:
 *                 video: "{videoId}"
 *                 likedBy: "{userId}"
 *                 _id: "{likeId}"
 *                 createdAt: "{createdAt}"
 *                 updatedAt: "{updatedAt}"
 *                 __v: 0
 *               message: Successfully liked the video.
 *               success: true
 *       400:
 *         description: Video id is required
 *       404:
 *         description: Video not found
 *       500:
 *         description: Something went wrong while liking video
 */

router.route("/toggle/v/:videoId").post(toggleVideoLike);

/**
 * @swagger
 * /api/v1/like/count/v/{videoId}:
 *   get:
 *     summary: Get likes count of a video
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: videoId
 *         required: true
 *         description: Id of the video
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved video likes count.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: { count: 0 }
 *               message: Successfully retrieved video likes count.
 *               success: true
 *       400:
 *         description: Video id is required
 *       404:
 *         description: Video not found
 */

router.route("/count/v/:videoId").get(getVideoLikesCount);

/**
 * @swagger
 * /api/v1/like/count/t/{tweetId}:
 *   get:
 *     summary: Get likes count of a tweet
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: tweetId
 *         required: true
 *         description: Id of the tweet
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved tweet likes count.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: { count: 0 }
 *               message: Successfully retrieved tweet likes count.
 *               success: true
 *       400:
 *         description: Tweet id is required
 *       404:
 *         description: Tweet not found
 */

router.route("/count/t/:tweetId").get(getTweetLikesCount);

/**
 * @swagger
 * /api/v1/like/count/c/{commentId}:
 *   get:
 *     summary: Get likes count of a comment
 *     tags:
 *       - Likes
 *     parameters:
 *       - in: path
 *         name: commentId
 *         required: true
 *         description: Id of the comment
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved comment likes count.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: { count: 0 }
 *               message: Successfully retrieved comment likes count.
 *               success: true
 *       400:
 *         description: Comment id is required
 *       404:
 *         description: Comment not found
 */

router.route("/count/c/:commentId").get(getCommentLikesCount);

/**
 * @swagger
 * /api/v1/like/videos:
 *   get:
 *     summary: Get liked videos
 *     tags:
 *       - Likes
 *     responses:
 *       200:
 *         description: Successfully retrieved liked videos.
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 - _id: "{likeId}"
 *                   video:
 *                     _id: "{videoId}"
 *                     videoFile: "{videoUrl}"
 *                     thumbnail: "{thumbnailUrl}"
 *                     title: "{videoTitle}"
 *                     description: "{videoDescription}"
 *                     duration: "{videoDuration}"
 *                     views: "{videoViews}"
 *                     isPublished: "{videoIsPublished}"
 *                     owner: "{videoOwnerId}"
 *                     createdAt: "{videoCreatedAt}"
 *                     updatedAt: "{videoUpdatedAt}"
 *                   likedBy: "{userId}"
 *                   createdAt: "{createdAt}"
 *                   updatedAt: "{updatedAt}"
 *                   __v: 0
 *               message: Successfully retrieved liked videos.
 *               success: true
 *       500:
 *         description: Something went wrong while retrieving liked videos
 */

router.route("/videos").get(getLikedVideos);

export default router;
