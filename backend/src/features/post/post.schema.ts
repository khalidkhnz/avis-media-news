import { Schema, model } from "mongoose";

const postSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  delta: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  tags: [{ type: String }], // Added field for tags
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PostSchema = model("posts", postSchema);

export default PostSchema;
