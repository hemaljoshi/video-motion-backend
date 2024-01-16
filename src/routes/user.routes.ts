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

router.route("/login").post(loginUser);

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(verifyJwtToken, logoutUser);

router.route("/change-password").post(verifyJwtToken, changeCurrentPassword);

router.route("/current-user").get(verifyJwtToken, getCurrentUser);

router.route("/update-account").patch(verifyJwtToken, updateAccountDetails);

router
  .route("/update-avatar")
  .patch(verifyJwtToken, upload.single("avatar"), updateAvatar);

router
  .route("/update-coverimage")
  .patch(verifyJwtToken, upload.single("coverImage"), updateCoverImage);

router.route("/c/:username").get(verifyJwtToken, getUserChannelProfile);

router.route("/history").get(verifyJwtToken, getWatchHistory);

// TODO: add route for forgot password
// TODO: add route for reset password
// TODO: smtp server for sending emails

export default router;
