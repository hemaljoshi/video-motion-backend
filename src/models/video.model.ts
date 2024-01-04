import mongoose from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";
import { User } from "./user.model";

const videoSchema = new mongoose.Schema(
  {
    videoFile: { type: String, required: true },
    thumbnail: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    duration: { type: Number, required: true },
    views: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

videoSchema.pre("findOneAndDelete", async function (next) {
  const videoId = this.getQuery()["_id"];

  try {
    await User.updateMany({}, { $pull: { watchHistory: { video: videoId } } });
    next();
  } catch (error) {
    next(error);
  }
});

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema);
