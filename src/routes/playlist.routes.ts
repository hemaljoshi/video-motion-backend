import { Router } from "express";
import {
  addToPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylist,
  removeFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";

const router = Router();

router.route("/add-to-playlist").post(addToPlaylist);

router.route("/remove-from-playlist").post(removeFromPlaylist);

router.route("/delete-playlist/:id").delete(deletePlaylist);

router.route("/update-playlist").patch(updatePlaylist);

router.route("/:id").get(getPlaylist);

router.route("/").get(getAllPlaylists)

export default router;
