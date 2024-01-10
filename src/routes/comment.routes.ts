import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";
const router = Router();

router.route("/:id").post(addComment).get(getComments);

router.route("/c/:commentId").delete(deleteComment).patch(updateComment);

export default router;
