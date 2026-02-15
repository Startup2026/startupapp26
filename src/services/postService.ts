import { apiFetch } from "@/lib/api";

export interface Post {
  _id: string;
  startupid: any;
  title?: string;
  description?: string;
  media?: {
    photo?: string;
    video?: string;
  };
  likes: string[];
  comments: any[];
  createdAt: string;
}

export const postService = {
  createPost: async (formData: FormData) => {
    return apiFetch<Post>('/posts/create-post', {
      method: "POST",
      body: formData, // FormData handles headers
    });
  },

  getAllPosts: async () => {
    return apiFetch<Post[]>('/posts/get-all-posts');
  },

  getStartupPosts: async () => {
    return apiFetch<Post[]>('/posts/get-startup-posts');
  },

  getPostById: async (id: string) => {
    return apiFetch<Post>(`/posts/get-post/${id}`);
  },

  deletePost: async (id: string) => {
    return apiFetch<void>(`/posts/delete-post/${id}`, {
      method: "DELETE",
    });
  },
};
