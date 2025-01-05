import { Response } from "express";
import {
  createPost,
  updatePost,
  getPost,
  getAllPosts,
  deletePost,
} from "../../services/post.service";
import { Types } from "mongoose";
import { AuthenticatedRequest } from "../../middlewares/authorization.middleware";

class PostController {
  async create(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const postData = req.body;
      postData.author = new Types.ObjectId(req.user?.id); // Grabbing author ID from authenticated user
      const post = await createPost(postData);
      res.status(201).json({ success: true, data: post });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async update(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const postId = new Types.ObjectId(req.params.id);
      const updateData = req.body;
      const post = await updatePost(postId, updateData);
      res.status(200).json({ success: true, data: post });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async get(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const postId = new Types.ObjectId(req.params.id);
      const post = await getPost(postId);
      if (!post) {
        res.status(404).json({ success: false, message: "Post not found" });
        return;
      }
      res.status(200).json({ success: true, data: post });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  // Example URL: /api/v1/posts?title=example&tags=tag1,tag2&sort={"createdAt":"desc"}&page=2&limit=5
  async getAll(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const { title, tags, sort, page, limit } = req.query;
      const query = {
        title: typeof title === "string" ? title : undefined,
        tags: typeof tags === "string" ? tags.split(",") : [],
      };
      const sortOptions = typeof sort === "string" ? JSON.parse(sort) : {};
      const posts = await getAllPosts(
        query,
        sortOptions,
        parseInt(typeof page === "string" ? page : "1"),
        parseInt(typeof limit === "string" ? limit : "10")
      );
      res.status(200).json({ success: true, data: posts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  async delete(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const postId = new Types.ObjectId(req.params.id);
      await deletePost(postId);
      res.status(204).json({ success: true });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}

export default new PostController();
