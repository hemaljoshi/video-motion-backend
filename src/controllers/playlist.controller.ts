import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { Video } from "../models/video.model";

const createPlaylist = asyncHandler(async (req : any, res: any) => {
  const { name, description } = req.body;

  if (!name || name.trim().length === 0) {
    return res.status(400).json(new ApiError(400, "Name is required"));
  }

  const playlist = await Playlist.create({
    playlistname: name,
    description,
    owner: req.user._id,
  });

  if (!playlist) {
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while creating playlist"));
  }

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req : any, res: any) => {
  const { playlistId, videos } = req.body;

  if (!playlistId) {
    return res.status(400).json(new ApiError(400, "PlaylistId is required"));
  }

  if (videos.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "At least one video is required"));
  }

  let Videos = await Video.find({ _id: { $in: videos } });

  if (!Videos) {
    return res
      .status(404)
      .json(new ApiError(404, "Video you are trying to add is not found"));
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $addToSet: { videos: videos } },
    { new: true }
  );

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Videos added to playlist successfully")
    );
});

const removeVideoFromPlaylist = asyncHandler(async (req : any, res: any) => {
  const { playlistId, videos } = req.body;

  if (!playlistId) {
    return res.status(400).json(new ApiError(400, "PlaylistId is required"));
  }

  if (videos.length === 0) {
    return res
      .status(400)
      .json(new ApiError(400, "At least one video is required"));
  }

  let Videos = await Video.find({ _id: { $in: videos } });

  if (!Videos) {
    return res
      .status(404)
      .json(new ApiError(404, "Video you are trying to remove is not found"));
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pullAll: { videos: videos } },
    { new: true }
  );

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "Video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req : any, res: any) => {
  const playlistId = req.params.playlistId;

  if (!playlistId) {
    return res.status(400).json(new ApiError(400, "playlistId is required"));
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req : any, res: any) => {
  const playlistId = req.params.playlistId;
  const { name, description } = req.body;

  if (!playlistId) {
    return res.status(400).json(new ApiError(400, "playlistId is required"));
  }

  if ((!name || name.trim().length === 0) || (!description || description.trim().length === 0)) { 
    return res.status(400).json(new ApiError(400, "Name and description are required"));
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { playlistname: name, description: description },
    { new: true }
  );

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

const getPlaylistById = asyncHandler(async (req : any, res: any) => {
  const playlistId = req.params.playlistId;

  if (!playlistId) {
    return res.status(400).json(new ApiError(400, "PlaylistId is required"));
  }

  const playlist = await Playlist.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(playlistId) },
    },
    {
      $lookup: {
        from: "videos",
        localField: "videos", // this is array of object ids
        foreignField: "_id",
        as: "videos",
      },
    },
    {
      $project: {
        _id: 1,
        playlistname: 1,
        description: 1,
        videos: {
          _id: 1,
          title: 1,
          description: 1,
          url: 1,
          thumbnail: 1,
          duration: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    },
  ]);

  if (!playlist) {
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
});

const getAllPlaylists = asyncHandler(async (req : any, res: any) => {
  const playlists = await Playlist.find({ owner: req.user._id });

  if (!playlists) {
    return res.status(404).json(new ApiError(404, "Playlists not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
});

export {
  createPlaylist,
  getAllPlaylists,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylistById,
};
