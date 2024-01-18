import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";
import { verifyJwtToken } from "../middlewares/auth.middleware";
const router = Router();

router.use(verifyJwtToken);

/**
 * @swagger
 * /api/v1/comments/{videoId}:
 *   post:
 *     tags:
 *       - Comments
 *     summary: Add a comment to a video
 *     description: Add a comment to a video
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
 *         description: Comment added successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 201
 *               data:
 *                 content: "{{commentContent}}"
 *                 owner: "{{ownerId}}"
 *                 video:
 *                   _id: "{{videoId}}"
 *                   videoFile: "{{videoFileUrl}}"
 *                   thumbnail: "{{thumbnailUrl}}"
 *                   title: "{{videoTitle}}"
 *                   description: "{{videoDescription}}"
 *                   duration: "{{videoDuration}}"
 *                   views: "{{videoViews}}"
 *                   isPublished: "{{isPublished}}"
 *                   owner: "{{ownerId}}"
 *                   createdAt: "{{createdAt}}"
 *                   updatedAt: "{{updatedAt}}"
 *                   __v: 0
 *                 _id: "{{commentId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "Comment added successfully"
 *               success: true
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Video not found
 *       500:
 *         description: Something went wrong while adding comment
 *   get:
 *     tags:
 *       - Comments
 *     summary: Get all comments of a video
 *     description: Get all comments of a video
 *     responses:
 *       200:
 *         description: Comments fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 comments:
 *                   - _id: "{{commentId}}"
 *                     content: "{{commentContent}}"
 *                     owner:
 *                       _id: "{{ownerId}}"
 *                       username: "{{ownerUsername}}"
 *                       fullname: "{{ownerFullname}}"
 *                       avatar: "{{ownerAvatar}}"
 *                     video: "{{videoId}}"
 *                     createdAt: "{{createdAt}}"
 *                     updatedAt: "{{updatedAt}}"
 *               message: "Comments fetched successfully"
 *               success: true
 *       400:
 *         description: Video id is required
 *       404:
 *         description: Comments not found
 *       500:
 *         description: Internal Server Error
 */

router.route("/:videoId").post(addComment).get(getComments);

/**
 * @swagger
 * /api/v1/comments/c/{commentId}:
 *   patch:
 *     tags:
 *       - Comments
 *     summary: Update a comment
 *     description: Update a comment
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
 *       200:
 *         description: Comment updated successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{commentId}}"
 *                 content: "{{commentContent}}"
 *                 owner:
 *                   _id: "{{ownerId}}"
 *                   content: "{{ownerContent}}"
 *                 video: "{{videoId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "Comment updated successfully"
 *               success: true
 *       400:
 *         description: Comment id is required
 *       404:
 *         description: Comment not found
 *   delete:
 *     tags:
 *       - Comments
 *     summary: Delete a comment
 *     description: Delete a comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: {}
 *               message: "Comment deleted successfully"
 *               success: true
 *       400:
 *         description: Comment id is required
 *       404:
 *         description: Comment not found
 */

router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
