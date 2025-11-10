/**
 * Videos service for educational video management
 * Integrates with backend API (api.video or mock data)
 */

import { logger } from "@/utils/logger";

export interface VideoFilters {
  subject?: string;
  level?: string;
  search?: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  subject: string;
  level: string;
  year: string;
  progress: number;
  views: number;
  likes: number;
  rating: number;
  subtitles: boolean;
  transcript: string;
  tags: string[];
  createdAt: Date;
  instructor: string;
}

class VideosService {
  private readonly baseUrl = "/api/videos"; // Backend BFF endpoint

  /**
   * Get videos with optional filters
   */
  async getVideos(filters: VideoFilters = {}): Promise<Video[]> {
    try {
      const params = new URLSearchParams();
      if (filters.subject) params.append("subject", filters.subject);
      if (filters.level) params.append("level", filters.level);
      if (filters.search) params.append("search", filters.search);

      const queryString = params.toString();
      const url = queryString ? `${this.baseUrl}?${queryString}` : this.baseUrl;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      // Backend devuelve ApiResponse<Video[]>
      if (result.success && result.data) {
        return result.data.map((v: any) => ({
          ...v,
          createdAt: new Date(v.createdAt),
        }));
      }

      throw new Error(result.error || "Failed to fetch videos");
    } catch (error) {
      logger.error("Error fetching videos:", error);
      throw new Error("Failed to fetch videos");
    }
  }

  /**
   * Get a specific video by ID
   */
  async getVideoById(id: string | number): Promise<Video | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.success && result.data) {
        return {
          ...result.data,
          createdAt: new Date(result.data.createdAt),
        };
      }

      return null;
    } catch (error) {
      logger.error("Error fetching video by ID:", error);
      return null;
    }
  }

  /**
   * Update video progress (stored locally for now)
   * NOTE: Will persist to backend when user tracking is implemented
   */
  async updateVideoProgress(
    videoId: string | number,
    progress: number
  ): Promise<boolean> {
    try {
      logger.debug(`Updating progress for video ${videoId} to ${progress}%`);

      // Store in localStorage for MVP
      const key = `video_progress_${videoId}`;
      localStorage.setItem(key, progress.toString());

      return true;
    } catch (error) {
      logger.error("Error updating video progress:", error);
      return false;
    }
  }

  /**
   * Get stored video progress
   */
  getVideoProgress(videoId: string | number): number {
    try {
      const key = `video_progress_${videoId}`;
      const stored = localStorage.getItem(key);
      return stored ? Number.parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  }

  /**
   * Like/unlike a video (stored locally for now)
   * NOTE: Will persist to backend when user interactions are implemented
   */
  async toggleVideoLike(videoId: string | number): Promise<boolean> {
    try {
      logger.debug(`Toggling like for video ${videoId}`);

      const key = `video_liked_${videoId}`;
      const isLiked = localStorage.getItem(key) === "true";
      localStorage.setItem(key, (!isLiked).toString());

      return true;
    } catch (error) {
      logger.error("Error toggling video like:", error);
      return false;
    }
  }

  /**
   * Check if video is liked
   */
  isVideoLiked(videoId: string | number): boolean {
    try {
      const key = `video_liked_${videoId}`;
      return localStorage.getItem(key) === "true";
    } catch {
      return false;
    }
  }

  /**
   * Get video transcript
   */
  async getVideoTranscript(videoId: string | number): Promise<string | null> {
    try {
      const video = await this.getVideoById(videoId);
      return video?.transcript || null;
    } catch (error) {
      logger.error("Error fetching video transcript:", error);
      return null;
    }
  }
}

// Export a singleton instance
export const videosService = new VideosService();

// Export as veedService for backward compatibility
export const veedService = videosService;
