import { Router } from "express";
import {
  changeCurrentPassword,
  getCurrentUser,
  getUserChannelProfile,
  getWatchHistory,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  updateAccountDetails,
  updateAvatar,
  updateCoverImage,
} from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJwtToken } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register user
 *     description: Register user
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               username:
 *                 type: string
 *               avatar:
 *                 type: string
 *                 format: binary
 *               coverImage:
 *                 type: string
 *                 format: binary
 *             required:
 *               - fullname
 *               - email
 *               - password
 *               - username
 *               - avatar
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: 
 *                 # Placeholder values
 *                 _id: "{{randomObjectId}}"
 *                 username: "{{username}}"
 *                 email: "{{email}}"
 *                 fullname: "{{fullname}}"
 *                 avatar: "{{avatarUrl}}"
 *                 coverImage: "{{coverImageUrl}}"
 *                 watchHistory: []
 *                 createdAt: "{{currentDateTime}}"
 *                 updatedAt: "{{currentDateTime}}"
 *                 __v: 0
 *               message: "User created successfully"
 *               success: true
 *       400:
 *         description: All fields are required
 *       409:
 *         description: Username or email already exists
 *       500:
 *         description: Error while creating user
 */

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     tags:
 *       - Users
 *     summary: Login user
 *     description: User login
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 user:
 *                   _id: "{{randomObjectId}}"
 *                   username: "{{username}}"
 *                   email: "{{email}}"
 *                   fullname: "{{fullname}}"
 *                   avatar: "{{avatarUrl}}"
 *                   coverImage: "{{coverImageUrl}}"
 *                   watchHistory: []
 *                   createdAt: "{{currentDateTime}}"
 *                   updatedAt: "{{currentDateTime}}"
 *                   __v: 0
 *                 accessToken: "{{accessToken}}"
 *                 refreshToken: "{{refreshToken}}" 
 *               message: "User logged in successfully"
 *               success: true
 *       400:
 *         description: Username and password are required
 *       401:
 *         description: Invalid credentials
 *       404:
 *         description: User not found
 *       500:
 *         description: Error while logging in user
 */

router.route("/login").post(loginUser);

/**
 * @swagger
 * /api/v1/users/logout:
 *   post:
 *     tags:
 *       - Users
 *     summary: Logout user
 *     description: |
 *       Endpoint to log out a user.
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: {}
 *               message: User logged out successfully
 *               success: true
 *       500:
 *         description: Error while logging out user
 */

router.route("/logout").post(verifyJwtToken, logoutUser);

/**
 * @swagger
 * /api/v1/users/refresh-token:
 *   post:
 *     tags:
 *       - Users
 *     summary: Refresh access token
 *     description: Refresh access token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 accessToken: "{{accessToken}}"
 *                 refreshToken: "{{refreshToken}}"
 *               message: Access token refreshed successfully
 *               success: true
 */

router.route("/refresh-token").post(refreshAccessToken);

/**
 * @swagger
 * /api/v1/users/change-password:
 *   post:
 *     tags:
 *       - Users
 *     summary: Change current password
 *     description: Change current password
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *             required:
 *               - currentPassword
 *               - newPassword
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data: {}
 *               message: Password changed successfully
 *               success: true
 *       500:
 *         description: Error while changing password
 */

router.route("/change-password").post(verifyJwtToken, changeCurrentPassword);

/**
 * @swagger
 * /api/v1/users/current-user:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get current user
 *     description: Get current user
 *     responses:
 *       200:
 *         description: Current user fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{randomObjectId}}"
 *                 fullname: "{{fullname}}"
 *                 username: "{{username}}"
 *                 email: "{{email}}"
 *                 avatar: "{{avatarUrl}}"
 *                 coverImage: "{{coverImageUrl}}"
 *                 watchHistory: "[{{videoIds}}]"
 *                 createdAt: "{{currentDateTime}}"
 *                 updatedAt: "{{currentDateTime}}"
 *                 __v: 0
 *               message: Current user fetched successfully
 *               success: true
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Error while fetching current user
 */

router.route("/current-user").get(verifyJwtToken, getCurrentUser);

/**
 * @swagger
 * /api/v1/users/update-account:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update account details
 *     description: Update account details
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullname:
 *                 type: string
 *               email:
 *                 type: string
 *               username:
 *                 type: string
 *             required:
 *               - fullname
 *               - email
 *               - username
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{randomObjectId}}"
 *                 fullname: "{{fullname}}"
 *                 username: "{{username}}"
 *                 email: "{{email}}"
 *                 avatar: "{{avatarUrl}}"
 *                 coverImage: "{{coverImageUrl}}"
 *                 watchHistory: "[{{videoIds}}]"
 *                 createdAt: "{{currentDateTime}}"
 *                 updatedAt: "{{currentDateTime}}"
 *                 __v: 0
 *               message: User updated successfully
 *               success: true
 *       500:
 *         description: Error while updating user
 */

router.route("/update-account").patch(verifyJwtToken, updateAccountDetails);

/**
 * @swagger
 * /api/v1/users/update-avatar:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update avatar
 *     description: Update avatar
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *             required:
 *               - avatar
 *     responses:
 *       200:
 *         description: Avatar updated successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 # Placeholder values
 *                 _id: "{{randomObjectId}}"
 *                 username: "{{username}}"
 *                 email: "{{email}}"
 *                 fullname: "{{fullname}}"
 *                 avatar: "{{updatedAvatarUrl}}"
 *                 coverImage: "{{coverImageUrl}}"
 *                 watchHistory: []
 *                 createdAt: "{{currentDateTime}}"
 *                 updatedAt: "{{currentDateTime}}"
 *                 __v: 0
 *               message: Avatar updated successfully
 *               success: true
 *       400:
 *         description: Avatar is required
 *       500-upload:
 *         description: Error while uploading files on cloudinary
 *       500-update:
 *         description: Error while updating user
 *       500-delete:
 *         description: Error while deleting old avatar
 */

router
  .route("/update-avatar")
  .patch(verifyJwtToken, upload.single("avatar"), updateAvatar);

/**
 * @swagger
 * /api/v1/users/update-coverimage:
 *   patch:
 *     tags:
 *       - Users
 *     summary: Update cover image
 *     description: Update cover image
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               coverImage:
 *                 type: string
 *                 format: binary
 *             required:
 *               - coverImage
 *     responses:
 *       200:
 *         description: Cover image updated successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 # Placeholder values
 *                 _id: "{{randomObjectId}}"
 *                 username: "{{username}}"
 *                 email: "{{email}}"
 *                 fullname: "{{fullname}}"
 *                 avatar: "{{updatedAvatarUrl}}"
 *                 coverImage: "{{coverImageUrl}}"
 *                 watchHistory: []
 *                 createdAt: "{{currentDateTime}}"
 *                 updatedAt: "{{currentDateTime}}"
 *                 __v: 0
 *               message: Cover image updated successfully
 *               success: true
 *       400:
 *         description: Cover image is required
 *       500-upload:
 *         description: Error while uploading files on cloudinary
 *       500-update:
 *         description: Error while updating user
 *       500-delete:
 *         description: Error while deleting old cover image
 */

router
  .route("/update-coverimage")
  .patch(verifyJwtToken, upload.single("coverImage"), updateCoverImage);

/**
 * @swagger
 * /api/users/{username}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get user channel profile
 *     description: Get user channel profile
 *     parameters:
 *       - name: username
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User channel fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "{{randomObjectId}}"
 *                 fullname: "{{fullname}}"
 *                 username: "{{username}}"
 *                 email: "{{email}}"
 *                 avatar: "{{avatarUrl}}"
 *                 coverImage: "{{coverImageUrl}}"
 *                 watchHistory: "[{{videoIds}}]"
 *                 createdAt: "{{currentDateTime}}"
 *                 updatedAt: "{{currentDateTime}}"
 *                 __v: 0
 *               message: User channel fetched successfully
 *               success: true
 *       400:
 *         description: Username is required
 *       404:
 *         description: Channel does not exist
 *       500:
 *         description: Error while fetching user channel profile
 */

router.route("/c/:username").get(verifyJwtToken, getUserChannelProfile);

/**
 * @swagger
 * /api/users/history:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get watch history
 *     description: Get watch history
 *     responses:
 *       200:
 *         description: Watch history fetched successfully
 *         content:
 *           application/json:
 *             example:
 *               statusCode: 200
 *               data:
 *                 _id: "65a5dcabbd2d602c1269fa4a"
 *                 watchHistory:
 *                   - video:
 *                       _id: "{{randomObjectId}}"
 *                       videoFile: "{{videoFileUrl}}"
 *                       thumbnail: "{{thumbnailUrl}}"
 *                       title: "{{videoTitle}}"
 *                       description: "{{videoDescription}}"
 *                       duration: "{{videoDuration}}"
 *                       views: "{{videoViews}}"
 *                       isPublished: "{{videoIsPublished}}"
 *                       owner: "{{randomObjectId}}"
 *                       createdAt: "{{currentDateTime}}"
 *                       updatedAt: "{{currentDateTime}}"
 *                       __v: 0
 *                     position: "{{videoPosition}}"
 *                     timestamp: "{{currentDateTime}}"
 *                     _id: "{{randomObjectId}}"
 *               message: "Watch history fetched successfully"
 *               success: true
 *       401:
 *         description: Unauthorized request
 *       500:
 *         description: Error while fetching watch history
 */

router.route("/history").get(verifyJwtToken, getWatchHistory);

// TODO: add route for forgot password
// TODO: add route for reset password
// TODO: smtp server for sending emails

export default router;
