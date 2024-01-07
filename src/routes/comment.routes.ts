import { Router } from "express";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";
const router = Router();

router.route("/add-comment").post(addComment);

router.route("/delete-comment/:id").delete(deleteComment);

router.route("/update-comment/:id").patch(updateComment);

router.route("/:id").get(getComments);

export default router;
