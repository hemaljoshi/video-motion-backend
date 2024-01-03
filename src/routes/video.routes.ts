import { Router } from "express";
import { addVideo } from "../controllers/video.controller";
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

export default router