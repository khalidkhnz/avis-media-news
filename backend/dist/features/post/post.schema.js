"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    description: { type: String, required: true },
    delta: { type: String, required: true },
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "auths", required: true },
    tags: [{ type: String }],
    categories: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "categories" }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
const PostSchema = (0, mongoose_1.model)("posts", postSchema);
exports.default = PostSchema;
