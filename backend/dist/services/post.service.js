"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.getPost = getPost;
exports.getAllPosts = getAllPosts;
exports.deletePost = deletePost;
const post_schema_1 = __importDefault(require("../features/post/post.schema"));
function createPost(postData) {
    return __awaiter(this, void 0, void 0, function* () {
        const newPost = new post_schema_1.default(Object.assign(Object.assign({}, postData), { createdAt: new Date(), updatedAt: new Date() }));
        try {
            const savedPost = yield newPost.save();
            return savedPost.toObject();
        }
        catch (error) {
            console.error("Error creating post:", error);
            throw error;
        }
    });
}
function updatePost(postId, updateData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const updatedPost = yield post_schema_1.default.findByIdAndUpdate(postId, updateData, {
                new: true,
            });
            if (!updatedPost) {
                throw new Error("Post not found");
            }
            return updatedPost.toObject();
        }
        catch (error) {
            console.error("Error updating post:", error);
            throw error;
        }
    });
}
function getPost(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const post = yield post_schema_1.default.findById(postId);
            return post ? post.toObject() : null;
        }
        catch (error) {
            console.error("Error retrieving post:", error);
            throw error;
        }
    });
}
function getAllPosts(query_1, sort_1) {
    return __awaiter(this, arguments, void 0, function* (query, sort, page = 1, limit = 10) {
        try {
            const searchQuery = {};
            if (query.title) {
                searchQuery.title = { $regex: query.title, $options: "i" };
            }
            if (query.tags && query.tags.length > 0) {
                searchQuery.tags = { $all: query.tags };
            }
            const posts = yield post_schema_1.default.find(searchQuery)
                .sort(sort)
                .skip((page - 1) * limit)
                .limit(limit);
            return posts.map((post) => post.toObject());
        }
        catch (error) {
            console.error("Error retrieving posts:", error);
            throw error;
        }
    });
}
function deletePost(postId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield post_schema_1.default.findByIdAndDelete(postId);
            if (!result) {
                throw new Error("Post not found");
            }
        }
        catch (error) {
            console.error("Error deleting post:", error);
            throw error;
        }
    });
}
