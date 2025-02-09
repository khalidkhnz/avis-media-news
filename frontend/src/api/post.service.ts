export interface PostDoc {
  title: string;
  description: string;
  delta: string;
  author?: string;
  tags?: string[];
}

import API from "./interceptor";

export const PostService = {
  async createPost(body: PostDoc) {
    const endpoint = "/posts";
    try {
      const response = await API.post(endpoint, body);
      return response?.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  async getAllPosts() {
    const endpoint = "/posts-v2?limit=10000000000&page=1";
    try {
      const response = await API.get(endpoint);
      return response?.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
