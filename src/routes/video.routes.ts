import { Router } from "express";
import {
  addVideo,
  addVideoToWatchHistory,
  deleteVideo,
  deleteVideoFromWatchHistory,
  increaseViewCount,
} from "../controllers/video.controller";
import { verifyJwtToken } from "../middlewares/auth.middleware";
import { upload } from "../middlewares/multer.middleware";
const router = Router();

router.route("/").post(
  verifyJwtToken,
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
  addVideo
);

router
  .route("/increase-view-count/:videoId")
  .patch(verifyJwtToken, increaseViewCount);

router
  .route("/add-to-watch-history/:videoId")
  .patch(verifyJwtToken, addVideoToWatchHistory);

router
  .route("/delete-video-from-history/:videoId")
  .delete(verifyJwtToken, deleteVideoFromWatchHistory);

router.route("/:videoId").delete(verifyJwtToken, deleteVideo);

export default router;
