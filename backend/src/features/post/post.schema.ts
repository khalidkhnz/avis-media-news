import { Schema, model } from "mongoose";

const richTextPostSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const RichTextPost = model("RichTextPost", richTextPostSchema);

export default RichTextPost;
