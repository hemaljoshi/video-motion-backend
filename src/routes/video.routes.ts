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

router.route("/")
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

router
  .route("/increase-view-count/:videoId")
  .patch(increaseViewCount);

router
  .route("/watch-history/:videoId")
  .patch(addVideoToWatchHistory);

router
  .route("/delete-video-from-history/:videoId")
  .delete(deleteVideoFromWatchHistory);

router.route("/:videoId").delete(deleteVideo).get(getVideoById).patch(upload.single("thumbnail"), updateVideoDetails);

router.route("/toggle-published-status/:videoId").patch(togglePublishStatus)

export default router;
