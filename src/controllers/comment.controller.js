import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import { Comment } from "../models/comment.model.js"
import {ApiResponse} from "../utils/ApiResponse.js"

export const createComment = asyncHandler(async (req, res, next) => {
    const { videoId, text } = req.body;

    if (!videoId || !text) {
        return next(new ApiError(400, "Video ID and text are required"));
    }

    const comment = new Comment({
        videoId,
        text,
        user: req.user?.id
    });

    await comment.save();

    res.status(201).json(new ApiResponse(201, "Comment created successfully", comment));
});

export const updateComment = asyncHandler(async (req, res, next) => {
    const { commentId, text } = req.body;

    if (!commentId || !text) {
        return next(new ApiError(400, "Comment ID and text are required"));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        return next(new ApiError(404, "Comment not found"));
    }

    if (comment.user.toString() !== req.user.id) {
        return next(new ApiError(403, "You are not authorized to update this comment"));
    }

    comment.text = text;
    await comment.save();

    res.status(200).json(new ApiResponse(200, "Comment updated successfully", comment));
});

export const deleteComment = asyncHandler(async (req, res, next) => {
    const { commentId } = req.body;

    if (!commentId) {
        return next(new ApiError(400, "Comment ID is required"));
    }

    const comment = await Comment.findById(commentId);

    if (!comment) {
        return next(new ApiError(404, "Comment not found"));
    }

    if (comment.user.toString() !== req.user.id) {
        return next(new ApiError(403, "You are not authorized to delete this comment"));
    }

    await comment.remove();

    res.status(200).json(new ApiResponse(200, "Comment deleted successfully"));
});

export const getCommentsByVideoId = asyncHandler(async (req, res, next) => {
    const { videoId } = req.params;

    if (!videoId) {
        return next(new ApiError(400, "Video ID is required"));
    }

    const comments = await Comment.find({ videoId });

    if (!comments.length) {
        return next(new ApiError(404, "No comments found for this video"));
    }

    res.status(200).json(new ApiResponse(200, "Comments retrieved successfully", comments));
});