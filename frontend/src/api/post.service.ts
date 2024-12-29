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
      return response.data;
    } catch (error) {
      console.log(error);
      return null;
    }
  },
};
