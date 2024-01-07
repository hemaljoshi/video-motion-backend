import { Router } from "express";
import {
  addVideo,
  addVideoToWatchHistory,
  deleteVideo,
  deleteVideoFromWatchHistory,
  getAllVideos,
  increaseViewCount,
} from "../controllers/video.controller";
import { upload } from "../middlewares/multer.middleware";
const router = Router();

router.route("/").post(
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
  .patch(increaseViewCount);

router
  .route("/add-to-watch-history/:videoId")
  .patch(addVideoToWatchHistory);

router
  .route("/delete-video-from-history/:videoId")
  .delete(deleteVideoFromWatchHistory);

router.route("/:videoId").delete(deleteVideo);

router.route("/").get(getAllVideos);

export default router;
