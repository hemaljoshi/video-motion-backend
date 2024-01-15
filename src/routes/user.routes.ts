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

router.route("/refresh-token").post(refreshAccessToken);

router.route("/logout").post(logoutUser);

router.route("/change-password").post(changeCurrentPassword);

router.route("/current-user").get(getCurrentUser);

router.route("/update-account").patch(updateAccountDetails);

router.route("/update-avatar").patch(upload.single("avatar"), updateAvatar);

router
  .route("/update-coverimage")
  .patch(upload.single("coverImage"), updateCoverImage);

router.route("/c/:username").get(getUserChannelProfile);

router.route("/history").get(getWatchHistory);

// TODO: add route for forgot password
// TODO: add route for reset password
// TODO: smtp server for sending emails

export default router;
