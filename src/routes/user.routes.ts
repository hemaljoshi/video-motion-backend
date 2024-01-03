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

// secured route
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

router.route("/c/:username").get(verifyJwtToken, getUserChannelProfile)

router.route("/history").get(verifyJwtToken, getWatchHistory)

export default router;
