import { Router } from "express";
import { verifyJwtToken } from "../middlewares/auth.middleware";
import {
  addToPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylist,
  removeFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";

const router = Router();

router.route("/add-to-playlist").post(verifyJwtToken, addToPlaylist);

router.route("/remove-from-playlist").post(verifyJwtToken, removeFromPlaylist);

router.route("/delete-playlist/:id").delete(verifyJwtToken, deletePlaylist);

router.route("/update-playlist").patch(verifyJwtToken, updatePlaylist);

router.route("/:id").get(verifyJwtToken, getPlaylist);

router.route("/").get(verifyJwtToken, getAllPlaylists)

export default router;
