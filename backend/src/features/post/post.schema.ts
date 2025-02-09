import { Schema, model } from "mongoose";

const postSchema = new Schema({
  title: { type: String, required: true },
  thumbnail: { type: String, required: true },
  description: { type: String, required: true },
  delta: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "auths", required: true },
  tags: [{ type: String }],
  categories: [{ type: Schema.Types.ObjectId, ref: "categories" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const PostSchema = model("posts", postSchema);

export default PostSchema;
