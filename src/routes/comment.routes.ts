import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";
import { verifyJwtToken } from "../middlewares/auth.middleware";
const router = Router();

router.use(verifyJwtToken);

router.route("/:id").post(addComment).get(getComments);

router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
