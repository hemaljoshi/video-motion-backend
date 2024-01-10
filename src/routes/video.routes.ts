import { Router } from "express";
import {
  publishVideo,
  addVideoToWatchHistory,
  deleteVideo,
  deleteVideoFromWatchHistory,
  getAllVideos,
  increaseViewCount,
  getVideoById,
  updateVideo,
  tooglePublishStatus,
} from "../controllers/video.controller";
import { upload } from "../middlewares/multer.middleware";
const router = Router();

router.route("/videos")
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

router.route("/:videoId").delete(deleteVideo).get(getVideoById).patch(upload.single("thumbnail"), updateVideo);

router.route("/toogle-published-status/:videoId").patch(tooglePublishStatus)

export default router;
