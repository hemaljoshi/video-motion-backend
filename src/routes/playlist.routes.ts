import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";
import { verifyJwtToken } from "../middlewares/auth.middleware";

const router = Router();

router.use(verifyJwtToken);

/**
 * @swagger
 * /api/v1/playlist:
 *   post:
 *     tags:
 *       - Playlist
 *     summary: Create a new playlist
 *     description: Create a new playlist
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       201:
 *         description: Playlist created successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 201
 *               data:
 *                 playlistname: "{{name}}"
 *                 description: "{{description}}"
 *                 videos: []
 *                 owner: "{{ownerId}}"
 *                 _id: "{{playlistId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "Playlist created successfully"
 *               success: true
 *       400:
 *         description: Name and description are required
 *       500:
 *         description: Something went wrong while creating playlist
 *   get:
 *     tags:
 *       - Playlist
 *     summary: Get all playlists
 *     description: Get all playlists
 *     responses:
 *       200:
 *         description: Playlists retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 - playlistname: "{{name}}"
 *                   description: "{{description}}"
 *                   videos: []
 *                   owner: "{{ownerId}}"
 *                   _id: "{{playlistId}}"
 *                   createdAt: "{{createdAt}}"
 *                   updatedAt: "{{updatedAt}}"
 *                   __v: 0
 *               message: "Playlists retrieved successfully"
 *               success: true
 *       400:
 *         description: No playlists found
 *       500:
 *         description: Something went wrong while getting playlists
 */

router.route("/").post(createPlaylist).get(getAllPlaylists);

/**
 * @swagger
 * /api/v1/playlist/{playlistId}:
 *   get:
 *     tags:
 *       - Playlist
 *     summary: Get playlist by id
 *     description: Get playlist by id
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist id
 *     responses:
 *       200:
 *         description: Playlist retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 playlistname: "{{name}}"
 *                 description: "{{description}}"
 *                 videos: []
 *                 owner: "{{ownerId}}"
 *                 _id: "{{playlistId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "Playlist retrieved successfully"
 *               success: true
 *       400:
 *         description: PlaylistId is required
 *       404:
 *         description: Playlist not found
 *   patch:
 *     tags:
 *       - Playlist
 *     summary: Update playlist
 *     description: Update playlist
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string  
 *         required: true
 *         description: Playlist id
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *             required:
 *               - name
 *               - description
 *     responses:
 *       200:
 *         description: Playlist updated successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 playlistname: "{{name}}"
 *                 description: "{{description}}"
 *                 videos: []
 *                 owner: "{{ownerId}}"
 *                 _id: "{{playlistId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "Playlist updated successfully"
 *               success: true
 *       400:
 *         description: Playlist id is required
 *       400-payload:
 *         description: Name and description are required
 *       404:
 *         description: Playlist not found
 *   delete:
 *     tags:
 *       - Playlist
 *     summary: Delete playlist
 *     description: Delete playlist
 *     parameters:
 *       - in: path
 *         name: playlistId
 *         schema:
 *           type: string
 *         required: true
 *         description: Playlist id
 *     responses:
 *       200:
 *         description: Playlist deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: {}
 *               message: "Playlist deleted successfully"
 *               success: true
 *       400:
 *         description: Playlist id is required
 *       404:
 *         description: Playlist not found
 */

router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

/**
 * @swagger
 * /api/v1/playlist/add:
 *   patch:
 *     tags:
 *       - Playlist
 *     summary: Add video to playlist
 *     description: Add video to playlist
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playlistId:
 *                 type: string
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - playlistId
 *               - videos
 *     responses:
 *       200:
 *         description: Videos added to playlist successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 playlistname: "{{name}}"
 *                 description: "{{description}}"
 *                 videos: ["{{videoId}}"]
 *                 owner: "{{ownerId}}"
 *                 _id: "{{playlistId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "Videos added to playlist successfully"
 *               success: true
 *       400:
 *         description: PlaylistId is required
 *       400-payload:
 *         description: At least one video is required
 *       404:
 *         description: Video you are trying to add is not found
 *       404-playlist:
 *         description: Playlist not found
 */

router.route("/add").patch(addVideoToPlaylist);

/**
 * @swagger
 * /api/v1/playlist/remove:
 *   patch:
 *     tags:
 *       - Playlist
 *     summary: Remove video from playlist
 *     description: Remove video from playlist
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               playlistId:
 *                 type: string
 *               videos:
 *                 type: array
 *                 items:
 *                   type: string
 *             required:
 *               - playlistId
 *               - videos
 *     responses:
 *       200:
 *         description: Video removed from playlist successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 playlistname: "{{name}}"
 *                 description: "{{description}}"
 *                 videos: []
 *                 owner: "{{ownerId}}"
 *                 _id: "{{playlistId}}"
 *                 createdAt: "{{createdAt}}"
 *                 updatedAt: "{{updatedAt}}"
 *                 __v: 0
 *               message: "Video removed from playlist successfully"
 *               success: true
 *       400:
 *         description: PlaylistId is required
 *       400-payload:
 *         description: At least one video is required
 *       404:
 *         description: Video you are trying to remove is not found
 *       404-playlist:
 *         description: Playlist not found
 */

router.route("/remove").patch(removeVideoFromPlaylist);

export default router;
