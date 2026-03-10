// src/services/feedService.ts
import { apiFetch } from '@/lib/api';

export interface PostAnalytics {
  views_count: number;
  unique_views_count: number;
  likes_count: number;
  comments_count: number;
  saves_count: number;
  shares_count: number;
  engagement_rate: number;
}

export interface Post {
  _id: string;
  title: string;
  description: string;
  media?: {
    video?: string;
    photo?: string;
  };
  createdAt: string;
  analytics: PostAnalytics;
  isLiked?: boolean;
  isSaved?: boolean;
}

export const feedService = {
  getFeed: async (page = 1, limit = 10) => {
    return apiFetch<{ data: Post[]; meta: any }>(`/feed?page=${page}&limit=${limit}`);
  },

  getMyPosts: async (sort = 'latest') => {
    return apiFetch<{ data: Post[] }>(`/feed/my-posts?sort=${sort}`);
  },

  toggleLike: async (postId: string) => {
    return apiFetch(`/feed/${postId}/like`, { method: 'POST' });
  },

  toggleSave: async (postId: string) => {
    return apiFetch(`/feed/${postId}/save`, { method: 'POST' });
  }
};
