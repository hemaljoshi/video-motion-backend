import { Router } from "express";
import {
  createTweet,
  deleteTweet,
  getAllTweet,
  getUserTweet,
  updateTweet,
} from "../controllers/tweet.controller";
import { verifyJwtToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJwtToken);

/**
 * @swagger
 * /api/v1/tweets:
 *   post:
 *     tags:
 *       - Tweets
 *     summary: Create a tweet
 *     description: Create a tweet
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             required:
 *               - content
 *     responses:
 *       201:
 *         description: Tweet created successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 201
 *               data:
 *                 content: "{{tweetContent}}"
 *                 owner: "{{userId}}"
 *                 _id: "{{tweetId}}"
 *                 createdAt: "2024-01-18T01:30:50.456Z"
 *                 updatedAt: "2024-01-18T01:30:50.456Z"
 *                 __v: 0
 *               message: Tweet created successfully
 *               success: true
 *       400:
 *         description: Tweet content is required
 *       500:
 *         description: Something went wrong while creating tweet
 *   get:
 *     tags:
 *       - Tweets
 *     summary: Get all tweets
 *     description: Get all tweets
 *     responses:
 *       200:
 *         description: All tweets fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 - _id: "{{tweetId}}"
 *                   content: "{{tweetContent}}"
 *                   owner:
 *                     _id: "{{userId}}"
 *                     username: "{{username}}"
 *                     fullname: "{{fullname}}"
 *                     avatar: "{{avatar}}"
 *                   createdAt: "2024-01-18T01:30:50.456Z"
 *                   updatedAt: "2024-01-18T01:30:50.456Z"
 *                   __v: 0
 *               message: All tweets fetched successfully
 *               success: true
 *       404:
 *         description: No tweet found
 */

router.route("/").get(getAllTweet).post(createTweet);

/**
 * @swagger
 * /api/v1/tweets/user/{userId}:
 *   get:
 *     tags:
 *       - Tweets
 *     summary: Get user tweets
 *     description: Get user tweets
 *     parameters:
 *       - name: userId
 *         in: path
 *         required: true
 *         description: User id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User tweets fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 - _id: "{{tweetId}}"
 *                   content: "{{tweetContent}}"
 *                   owner:
 *                     _id: "{{userId}}"
 *                     username: "{{username}}"
 *                     fullname: "{{fullname}}"
 *                     avatar: "{{avatar}}"
 *                   createdAt: "2024-01-18T01:30:50.456Z"
 *                   updatedAt: "2024-01-18T01:30:50.456Z"
 *                   __v: 0
 *               message: User tweets fetched successfully
 *               success: true
 *       400:
 *         description: User id is required
 *       404:
 *         description: Tweet not found
 */

router.route("/user/:userId").get(getUserTweet);

/**
 * @swagger
 * /api/v1/tweets/{tweetId}:
 *   patch:
 *     tags:
 *       - Tweets
 *     summary: Update a tweet
 *     description: Update a tweet
 *     parameters:
 *       - name: tweetId
 *         in: path
 *         required: true
 *         description: Tweet id
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *             required:
 *               - content
 *       responses:
 *         200:
 *           description: Tweet updated successfully
 *           content:
 *             application/json:
 *               example:
 *                 statusCode: 200
 *                 data:
 *                   _id: "{{tweetId}}"
 *                   content: "{{tweetContent}}"
 *                   owner:
 *                     _id: "{{userId}}"
 *                     username: "{{username}}"
 *                     fullname: "{{fullname}}"
 *                     avatar: "{{avatar}}"
 *                   createdAt: "2024-01-18T01:30:50.456Z"
 *                   updatedAt: "2024-01-18T01:30:50.456Z"
 *                   __v: 0
 *                 message: Tweet updated successfully
 *                 success: true
 *         400:
 *           description: Content is required
 *         404:
 *           description: Tweet not found
 *   delete:
 *     tags:
 *       - Tweets
 *     summary: Delete a tweet
 *     description: Delete a tweet
 *     parameters:
 *       - name: tweetId
 *         in: path
 *         required: true
 *         description: Tweet id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tweet deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: {}
 *               message: Tweet deleted successfully
 *               success: true
 *       404:
 *         description: Tweet not found
 */

router.route("/:tweetId").patch(updateTweet).delete(deleteTweet);

export default router;