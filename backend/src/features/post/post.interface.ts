import { Types } from "mongoose";

export interface IPost {
  title: string;
  thumbnail: string;
  description: string;
  delta: string;
  author: string;
  tags: string[];
  categories: string[];
  createdAt: string;
  updatedAt: string;
}
