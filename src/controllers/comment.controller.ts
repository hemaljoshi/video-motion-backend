import { Comment } from "../models/comment.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";

const addComment = asyncHandler(async (req, res) => {
  const { content, video } = req.body;

  if (!content || !video) {
    return res.status(400).json(new ApiError(400, "Missing required fields"));
  }

  const newComment = await Comment.create({
    content,
    video,
    owner: req.user._id,
  });

  if (!newComment)
    return res
      .status(500)
      .json(new ApiError(500, "Something went wrong while adding comment"));

  return res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added"));
});

const deleteComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;

  if (!commentId) {
    return res.status(400).json(new ApiError(400, "Comment id is required"));
  }

  const deleteComment = await Comment.findByIdAndDelete(commentId);

  if (!deleteComment) {
    return res.status(404).json(new ApiError(404, "Comment not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteComment, "Comment deleted successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
  const commentId = req.params.id;
  const { content } = req.body;

  if (!commentId) {
    return res.status(400).json(new ApiError(400, "Comment id is required"));
  }

  const updateComment = await Comment.findByIdAndUpdate(
    commentId,
    { content },
    { new: true }
  );

  if (!updateComment) {
    return res.status(404).json(new ApiError(404, "Comment not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updateComment, "Comment updated successfully"));
});

const getComments = asyncHandler(async (req, res) => {
  const videoId = req.params.id;

  if (!videoId) {
    return res.status(400).json(new ApiError(400, "Video id is required"));
  }

  const comments = await Comment.find({ video: videoId }).populate({
    path: "owner", 
    select: ["username", "fullname", "avatar", "_id"],
  });

  if (!comments) {
    return res.status(404).json(new ApiError(404, "Comments not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched successfully"));
});

export { addComment, deleteComment, updateComment, getComments };
