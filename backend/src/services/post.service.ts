import { Types } from "mongoose";
import PostSchema from "../features/post/post.schema";
import { IPost } from "../features/post/post.interface";

async function createPost(postData: IPost): Promise<IPost> {
  const newPost = new PostSchema({
    ...postData,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  try {
    const savedPost = await newPost.save();
    return savedPost.toObject() as unknown as IPost;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

async function updatePost(
  postId: Types.ObjectId,
  updateData: Partial<IPost>
): Promise<IPost> {
  try {
    const updatedPost = await PostSchema.findByIdAndUpdate(postId, updateData, {
      new: true,
    });
    if (!updatedPost) {
      throw new Error("Post not found");
    }
    return updatedPost.toObject() as unknown as IPost;
  } catch (error) {
    console.error("Error updating post:", error);
    throw error;
  }
}

async function getPost(postId: Types.ObjectId): Promise<IPost | null> {
  try {
    const post = await PostSchema.findById(postId);
    return post ? (post.toObject() as unknown as IPost) : null;
  } catch (error) {
    console.error("Error retrieving post:", error);
    throw error;
  }
}

async function getAllPosts(
  query: { title?: string; tags?: string[] },
  sort: { [key: string]: "asc" | "desc" },
  page: number = 1,
  limit: number = 10
): Promise<IPost[]> {
  try {
    const searchQuery: {
      title?: { $regex: string; $options: string };
      tags?: { $all: string[] };
    } = {};
    if (query.title) {
      searchQuery.title = { $regex: query.title, $options: "i" };
    }
    if (query.tags && query.tags.length > 0) {
      searchQuery.tags = { $all: query.tags };
    }
    const posts = await PostSchema.find(searchQuery)
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
    return posts.map((post) => post.toObject() as unknown as IPost);
  } catch (error) {
    console.error("Error retrieving posts:", error);
    throw error;
  }
}

async function deletePost(postId: Types.ObjectId): Promise<void> {
  try {
    const result = await PostSchema.findByIdAndDelete(postId);
    if (!result) {
      throw new Error("Post not found");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
}

export { createPost, updatePost, getPost, getAllPosts, deletePost };
