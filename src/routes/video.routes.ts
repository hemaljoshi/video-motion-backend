import { Router } from "express";
import {
  publishVideo,
  addVideoToWatchHistory,
  deleteVideo,
  deleteVideoFromWatchHistory,
  getAllVideos,
  increaseViewCount,
  getVideoById,
  togglePublishStatus,
  updateVideoDetails,
} from "../controllers/video.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwtToken } from "../middlewares/auth.middleware";
const router = Router();

router.use(verifyJwtToken);

/**
 * @swagger
 * /api/v1/videos:
 *   post:
 *     tags:
 *       - Videos
 *     summary: Publish a video
 *     description: Publish a video
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               videoFile:
 *                 type: string
 *                 format: binary
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Video uploaded successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 201
 *               data:
 *                 _id: "{{videoId}}"
 *                 videoFile: "{{videoFileUrl}}"
 *                 thumbnail: "{{thumbnailUrl}}"
 *                 title: "{{videoTitle}}"
 *                 description: "{{videoDescription}}"
 *                 duration: "{{videoDuration}}"
 *                 views: "{{videoViews}}"
 *                 isPublished: "{{isPublished}}"
 *                 owner: "{{ownerId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "Video uploaded successfully"
 *               success: true
 *       400:
 *         description: All fields are required
 *       400-video:
 *         description: Video is required
 *       400-thumbnail:
 *         description: Thumbnail is required
 *       500-video-cloudinary:
 *         description: Error while uploading video on cloudinary
 *       500-thumbnail-cloudinary:
 *         description: Error while uploading thumbnail on cloudinary
 *       500:
 *         description: Error while publishing video
 */

/**
 * @swagger
 * /api/v1/videos:
 *   get:
 *     tags:
 *       - Videos
 *     summary: Get all videos
 *     description: Get all videos
 *     responses:
 *       200:
 *         description: All videos fetched successfully
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
 *                 totalPages: 1
 *               message: "All videos fetched successfully"
 *               success: true
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Error while fetching videos
 */

router
  .route("/")
  .post(
    upload.fields([
      {
        name: "videoFile",
        maxCount: 1,
      },
      {
        name: "thumbnail",
        maxCount: 1,
      },
    ]),
    publishVideo
  )
  .get(getAllVideos);

/**
 * @swagger
 * /api/v1/videos/increase-view-count/{videoId}:
 *   patch:
 *     tags:
 *       - Videos
 *     summary: Increase view count
 *     description: Increase view count
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: View count incremented successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{videoId}}"
 *                 videoFile: "{{videoFileUrl}}"
 *                 thumbnail: "{{thumbnailUrl}}"
 *                 title: "{{videoTitle}}"
 *                 description: "{{videoDescription}}"
 *                 duration: "{{videoDuration}}"
 *                 views: "{{videoViews}}"
 *                 isPublished: "{{isPublished}}"
 *                 owner: "{{ownerId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "View count incremented successfully"
 *               success: true
 *       400:
 *         description: Video id is required
 *       404:
 *         description: Error while incrementing view count
 */

router.route("/increase-view-count/:videoId").patch(increaseViewCount);

/**
 * @swagger
 * /api/v1/videos/watch-history/{videoId}?position={position}:
 *   patch:
 *     tags:
 *       - Videos
 *     summary: Add video to watch history
 *     description: Add video to watch history
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: position
 *         schema:
 *           type: number
 *         required: true
 *     responses:
 *       200:
 *         description: Video added to watch history
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{userId}}"
 *                 username: "{{userUsername}}"
 *                 email: "{{userEmail}}"
 *                 fullname: "{{userFullname}}"
 *                 avatar: "{{userAvatar}}"
 *                 coverImage: "{{userCoverImage}}"
 *                 watchHistory:
 *                   - video: "{{videoId}}"
 *                     position: "{{videoPosition}}"
 *                     timestamp: "{{videoTimestamp}}"
 *                     _id: "{{watchHistoryId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: Video added to watch history
 *               success: true
 *       400-video:
 *         description: Video id is required
 *       400-position:
 *         description: Position is required
 *       404:
 *         description: Video not found
 */

router.route("/watch-history/:videoId").patch(addVideoToWatchHistory);

/**
 * @swagger
 * /api/v1/videos/delete-video-from-history/{videoId}:
 *   delete:
 *     tags:
 *       - Videos
 *     summary: Delete video from watch history
 *     description: Delete video from watch history
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Video deleted from watch history
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{userId}}"
 *                 username: "{{userUsername}}"
 *                 email: "{{userEmail}}"
 *                 fullname: "{{userFullname}}"
 *                 avatar: "{{userAvatar}}"
 *                 coverImage: "{{userCoverImage}}"
 *                 watchHistory: []
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: Video deleted from watch history
 *               success: true
 *       400:
 *         description: Video id is required
 *       500:
 *         description: Error while deleting video from watch history
 */

router
  .route("/delete-video-from-history/:videoId")
  .delete(deleteVideoFromWatchHistory);

/**
 * @swagger
 * /api/v1/videos/{videoId}:
 *   delete:
 *     tags:
 *       - Videos
 *     summary: Delete video
 *     description: Delete video
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Video deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: {}
 *               message: Video deleted successfully
 *               success: true
 *       400:
 *         description: Video id is required
 *       500:
 *         description: Error while deleting video
 */

/**
 * @swagger
 * /api/v1/videos/{videoId}:
 *   get:
 *     tags:
 *       - Videos
 *     summary: Get video by id
 *     description: Get video by id
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Video fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{videoId}}"
 *                 videoFile: "{{videoFileUrl}}"
 *                 thumbnail: "{{thumbnailUrl}}"
 *                 title: "{{videoTitle}}"
 *                 description: "{{videoDescription}}"
 *                 duration: "{{videoDuration}}"
 *                 views: "{{videoViews}}"
 *                 isPublished: "{{isPublished}}"
 *                 owner: "{{ownerId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: Video fetched successfully
 *               success: true
 *       400:
 *         description: Video id is required
 *       404:
 *         description: Video not found
 */

/**
 * @swagger
 * /api/v1/videos/{videoId}:
 *   patch:
 *     tags:
 *       - Videos
 *     summary: Update video details
 *     description: Update video details
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *           required:
 *             - thumbnail
 *             - title
 *             - description
 *     responses:
 *       200:
 *         description: Video updated successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{videoId}}"
 *                 videoFile: "{{videoFileUrl}}"
 *                 thumbnail: "{{thumbnailUrl}}"
 *                 title: "{{videoTitle}}"
 *                 description: "{{videoDescription}}"
 *                 duration: "{{videoDuration}}"
 *                 views: "{{videoViews}}"
 *                 isPublished: "{{isPublished}}"
 *                 owner: "{{ownerId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: Video updated successfully
 *               success: true
 *       400:
 *         description: Video id is required
 *       404:
 *         description: Video not found
 *       500-thumbnail-cloudinary:
 *         description: Error while uploading thumbnail on cloudinary
 *       500:
 *         description: Error while updating video details
 */

router
  .route("/:videoId")
  .delete(deleteVideo)
  .get(getVideoById)
  .patch(upload.single("thumbnail"), updateVideoDetails);

/**
 * @swagger
 * /api/v1/videos/toggle-published-status/{videoId}:
 *   patch:
 *     tags:
 *       - Videos
 *     summary: Toggle publish status
 *     description: Toggle publish status
 *     parameters:
 *       - in: path
 *         name: videoId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Video status updated
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{videoId}}"
 *                 videoFile: "{{videoFileUrl}}"
 *                 thumbnail: "{{thumbnailUrl}}"
 *                 title: "{{videoTitle}}"
 *                 description: "{{videoDescription}}"
 *                 duration: "{{videoDuration}}"
 *                 views: "{{videoViews}}"
 *                 isPublished: "{{isPublished}}"
 *                 owner: "{{ownerId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: Video status updated
 *               success: true
 *       400:
 *         description: Video id is required
 *       404:
 *         description: Video not found
 *       500:
 *         description: Error while updating video status
 */

router.route("/toggle-published-status/:videoId").patch(togglePublishStatus);

export default router;
