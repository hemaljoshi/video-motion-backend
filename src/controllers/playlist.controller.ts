import mongoose from "mongoose";
import { Playlist } from "../models/playlist.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const addToPlaylist = asyncHandler(async (req, res) => {
  const { name, description, videos } = req.body;
  if (videos.length === 0) {
    return res.status(400).json(new ApiError(400, "videos is required"));
  }

  if (!name || name.trim().length === 0) {
    return res.status(400).json(new ApiError(400, "name is required"));
  }

  const playlist = await Playlist.create({
    playlistname: name,
    description,
    videos: videos,
    owner: req.user._id,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, playlist, "Playlist created successfully"));
});

const removeFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videos } = req.body;

  if(!playlistId){
    return res.status(400).json(new ApiError(400, "playlistId is required"));
  }

  if(videos.length === 0){
    return res.status(400).json(new ApiError(400, "videos is required"));
  }

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    { $pullAll: { videos: videos } },
    { new: true }
  );

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const playlistId = req.params.id;

  if(!playlistId){
    return res.status(400).json(new ApiError(400, "playlistId is required"));
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId);

  if(!playlist){
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist deleted successfully"));
})

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId, name, description } = req.body;

  if(!playlistId){
    return res.status(400).json(new ApiError(400, "playlistId is required"));
  }

  if(!name || name.trim().length === 0){
    return res.status(400).json(new ApiError(400, "name is required"));
  }

  const playlist = await Playlist.findByIdAndUpdate(playlistId, { playlistname: name, description: description }, { new: true });

  if(!playlist){
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist updated successfully"));
})

const getPlaylist = asyncHandler(async (req, res) => { 
  const playlistId = req.params.id

  if(!playlistId){
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

  if(!playlist){
    return res.status(404).json(new ApiError(404, "Playlist not found"));
  }

  return res.status(200).json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
})

const getAllPlaylists = asyncHandler(async (req, res) => {
  const playlists = await Playlist.find({ owner: req.user._id });

  if(!playlists){
    return res.status(404).json(new ApiError(404, "Playlists not found"));
  }

  return res.status(200).json(new ApiResponse(200, playlists, "Playlists fetched successfully"));
})


export {
  addToPlaylist,
  removeFromPlaylist,
  deletePlaylist,
  updatePlaylist,
  getPlaylist,
  getAllPlaylists,
};
