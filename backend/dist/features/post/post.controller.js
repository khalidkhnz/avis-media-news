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
Object.defineProperty(exports, "__esModule", { value: true });
const post_service_1 = require("../../services/post.service");
const mongoose_1 = require("mongoose");
class PostController {
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const postData = req.body;
                postData.author = new mongoose_1.Types.ObjectId((_a = req.user) === null || _a === void 0 ? void 0 : _a.id); // Grabbing author ID from authenticated user
                const post = yield (0, post_service_1.createPost)(postData);
                res.status(201).json({ success: true, data: post });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = new mongoose_1.Types.ObjectId(req.params.id);
                const updateData = req.body;
                const post = yield (0, post_service_1.updatePost)(postId, updateData);
                res.status(200).json({ success: true, data: post });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = new mongoose_1.Types.ObjectId(req.params.id);
                const post = yield (0, post_service_1.getPost)(postId);
                if (!post) {
                    res.status(404).json({ success: false, message: "Post not found" });
                    return;
                }
                res.status(200).json({ success: true, data: post });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    // Example URL: /api/v1/posts?title=example&tags=tag1,tag2&sort={"createdAt":"desc"}&page=2&limit=5
    getAll(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { title, tags, sort, page, limit } = req.query;
                const query = {
                    title: typeof title === "string" ? title : undefined,
                    tags: typeof tags === "string" ? tags.split(",") : [],
                };
                const sortOptions = typeof sort === "string" ? JSON.parse(sort) : {};
                const posts = yield (0, post_service_1.getAllPosts)(query, sortOptions, parseInt(typeof page === "string" ? page : "1"), parseInt(typeof limit === "string" ? limit : "10"));
                res.status(200).json({ success: true, data: posts });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const postId = new mongoose_1.Types.ObjectId(req.params.id);
                yield (0, post_service_1.deletePost)(postId);
                res.status(204).json({ success: true });
            }
            catch (error) {
                res.status(500).json({ success: false, message: error.message });
            }
        });
    }
}
exports.default = new PostController();
