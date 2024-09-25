import mongoose from "mongoose";
import { Comment } from "../models/comment.model";
import ApiError from "../utils/ApiError";
import ApiResponse from "../utils/ApiResponse";
import asyncHandler from "../utils/asyncHandler";
import { Video } from "../models/video.model";

const addComment = asyncHandler(async (req : any, res: any) => {
  const videoId = req.params.videoId;
  const { content } = req.body;

  if (!content || !videoId) {
    return res.status(400).json(new ApiError(400, "Missing required fields"));
  }

  const video = await Video.findById(videoId);

  if (!video) {
    return res.status(404).json(new ApiError(404, "Video not found"));
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
    .json(new ApiResponse(201, newComment, "Comment added successfully"));
});

const deleteComment = asyncHandler(async (req : any, res: any) => {
  const commentId = req.params.commentId;

  if (!commentId) {
    return res.status(400).json(new ApiError(400, "Comment id is required"));
  }

  const deleteComment = await Comment.findByIdAndDelete(commentId);

  if (!deleteComment) {
    return res.status(404).json(new ApiError(404, "Comment not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

const updateComment = asyncHandler(async (req : any, res: any) => {
  const commentId = req.params.commentId;
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

const getComments = asyncHandler(async (req : any, res: any) => {
  try {
    const videoId = req.params.videoId;
    const { page = 1, limit = 10 } = req.query;

    if (!videoId) {
      return res.status(400).json(new ApiError(400, "Video id is required"));
    }

    const aggregate = Comment.aggregate([
      {
        $match: {
          video: new mongoose.Types.ObjectId(videoId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "owner",
        },
      },
      {
        $unwind: "$owner", // lookup returns an array, so we need to unwind it to get the object
      },
      {
        $project: {
          "owner.username": 1,
          "owner.fullname": 1,
          "owner.avatar": 1,
          "owner._id": 1,
          content: 1,
          video: 1,
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);

    // @ts-ignore
    const paginatedComments = await Comment.aggregatePaginate(aggregate, {
      page: parseInt(page),
      limit: parseInt(limit),
    });

    if (!paginatedComments) {
      return res.status(404).json(new ApiError(404, "Comments not found"));
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          comments: paginatedComments.docs,
          total: paginatedComments.totalDocs,
        },
        "Comments fetched successfully"
      )
    );
  } catch (error) {
    console.error("Error fetching comments:", error);
    return res.status(500).json(new ApiError(500, "Internal Server Error"));
  }
});

export { addComment, deleteComment, updateComment, getComments };
