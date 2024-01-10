import { Router } from "express";
import {
  addVideoToPlaylist,
  createPlaylist,
  deletePlaylist,
  getAllPlaylists,
  getPlaylistById,
  removeVideoFromPlaylist,
  updatePlaylist,
} from "../controllers/playlist.controller";

const router = Router();

router.route("/").post(createPlaylist).get(getAllPlaylists);

router
  .route("/:playlistId")
  .get(getPlaylistById)
  .patch(updatePlaylist)
  .delete(deletePlaylist);

router.route("/add").patch(addVideoToPlaylist);

router.route("/remove").patch(removeVideoFromPlaylist);

router.route("/user/:userId").get(getAllPlaylists);


export default router;
