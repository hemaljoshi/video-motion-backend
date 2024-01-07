import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware";
import {
  addComment,
  deleteComment,
  getComments,
  updateComment,
} from "../controllers/comment.controller";
const router = Router();

router.route("/add-comment").post(verifyJwtToken, addComment);

router.route("/delete-comment/:id").delete(verifyJwtToken, deleteComment);

router.route("/update-comment/:id").patch(verifyJwtToken, updateComment);

router.route("/:id").get(verifyJwtToken, getComments);

export default router;
