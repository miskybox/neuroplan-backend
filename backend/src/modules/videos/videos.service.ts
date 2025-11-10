import { Injectable } from "@nestjs/common";
import axios from "axios";
import { VideoFilters } from "./videos.controller";

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

@Injectable()
export class VideosService {
  private readonly apiVideoUrl =
    process.env.API_VIDEO_URL || "https://ws.api.video";
  private readonly apiVideoKey = process.env.API_VIDEO_KEY;
  private readonly useMockData =
    !this.apiVideoKey || process.env.VIDEOS_MOCK === "true";

  constructor() {
    if (this.useMockData) {
      console.log(
        "⚠️  API_VIDEO_KEY no configurada - usando datos mock para videos"
      );
    } else {
      console.log(
        `✅ api.video configurado: ${this.apiVideoUrl} (${this.apiVideoKey ? "key present" : "no key"})`
      );
    }
  }

  async getVideos(filters: VideoFilters = {}): Promise<Video[]> {
    if (this.useMockData) {
      return this.getMockVideos(filters);
    }

    try {
      const response = await axios.get(`${this.apiVideoUrl}/videos`, {
        headers: { Authorization: `Bearer ${this.apiVideoKey}` },
        params: filters.search ? { title: filters.search } : {},
      });

      const videos = response.data.data.map((v: any) =>
        this.mapApiVideoToVideo(v)
      );
      return this.applyFilters(videos, filters);
    } catch (error) {
      console.error("Error fetching videos from api.video:", error);
      // Fallback a mock data si falla la API
      return this.getMockVideos(filters);
    }
  }

  async getVideoById(id: string): Promise<Video | null> {
    if (this.useMockData) {
      const videos = await this.getMockVideos();
      return videos.find((v) => v.id === id) || null;
    }

    try {
      const { data: v } = await axios.get(`${this.apiVideoUrl}/videos/${id}`, {
        headers: { Authorization: `Bearer ${this.apiVideoKey}` },
      });
      return this.mapApiVideoToVideo(v);
    } catch (error) {
      console.error(`Error fetching video ${id} from api.video:`, error);
      // Fallback a mock data
      const videos = await this.getMockVideos();
      return videos.find((v) => v.id === id) || null;
    }
  }

  private mapApiVideoToVideo(v: any): Video {
    return {
      id: v.videoId,
      title: v.title ?? "Sin título",
      description: v.description ?? "",
      url: v.assets?.mp4 ?? v.assets?.hls ?? "",
      thumbnail: v.assets?.thumbnail ?? "",
      duration: v.duration ?? 0,
      subject:
        v.tags
          ?.find((t: string) => t.startsWith("subject:"))
          ?.replace("subject:", "") ?? "General",
      level:
        v.tags
          ?.find((t: string) => t.startsWith("level:"))
          ?.replace("level:", "") ?? "N/A",
      year:
        v.tags
          ?.find((t: string) => t.startsWith("year:"))
          ?.replace("year:", "") ?? "",
      progress: 0,
      views: v.stats?.views ?? 0,
      likes: 0,
      rating: 0,
      subtitles: false,
      transcript: "",
      tags: v.tags?.filter((t: string) => !t.includes(":")) ?? [],
      createdAt: new Date(v.createdAt),
      instructor: v.metadata?.instructor ?? "N/A",
    };
  }

  private applyFilters(videos: Video[], filters: VideoFilters): Video[] {
    let filtered = videos;

    if (filters.subject) {
      filtered = filtered.filter((v) =>
        v.subject.toLowerCase().includes(filters.subject!.toLowerCase())
      );
    }

    if (filters.level) {
      filtered = filtered.filter((v) =>
        v.level.toLowerCase().includes(filters.level!.toLowerCase())
      );
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(searchTerm) ||
          v.description.toLowerCase().includes(searchTerm) ||
          v.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
      );
    }

    return filtered;
  }

  private async getMockVideos(filters: VideoFilters = {}): Promise<Video[]> {
    const mockVideos: Video[] = [
      {
        id: "1",
        title: "Introducción a las Ecuaciones de Segundo Grado",
        description:
          "Aprende los conceptos básicos de las ecuaciones cuadráticas con ejemplos prácticos",
        url: "https://example.com/video1.mp4",
        thumbnail:
          "https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Matemáticas",
        duration: 1200,
        subject: "Matemáticas",
        level: "ESO",
        year: "3º ESO",
        progress: 75,
        views: 1250,
        likes: 89,
        rating: 4.8,
        subtitles: true,
        transcript:
          "En este video aprenderemos los conceptos básicos del álgebra...",
        tags: ["ecuaciones", "álgebra", "matemáticas", "segundo grado"],
        createdAt: new Date("2024-01-15"),
        instructor: "Prof. Ana Martínez",
      },
      {
        id: "2",
        title: "Historia de España: Siglo XX",
        description:
          "Repaso completo de los acontecimientos más importantes del siglo XX en España",
        url: "https://example.com/video2.mp4",
        thumbnail:
          "https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Historia",
        duration: 1800,
        subject: "Historia",
        level: "Bachillerato",
        year: "2º Bachillerato",
        progress: 45,
        views: 890,
        likes: 67,
        rating: 4.6,
        subtitles: true,
        transcript:
          "El siglo XX fue un período de grandes cambios en España...",
        tags: ["historia", "españa", "siglo xx", "guerra civil"],
        createdAt: new Date("2024-01-20"),
        instructor: "Prof. Carlos López",
      },
      {
        id: "3",
        title: "Fotosíntesis: Proceso Vital",
        description:
          "Explicación detallada del proceso de fotosíntesis en las plantas",
        url: "https://example.com/video3.mp4",
        thumbnail:
          "https://via.placeholder.com/300x200/059669/FFFFFF?text=Ciencias",
        duration: 900,
        subject: "Ciencias",
        level: "ESO",
        year: "2º ESO",
        progress: 100,
        views: 2100,
        likes: 156,
        rating: 4.9,
        subtitles: true,
        transcript: "La fotosíntesis es el proceso por el cual las plantas...",
        tags: ["fotosíntesis", "plantas", "biología", "ciencias naturales"],
        createdAt: new Date("2024-01-25"),
        instructor: "Prof. María García",
      },
      {
        id: "4",
        title: "Gramática Española: Verbos Irregulares",
        description: "Estudio completo de los verbos irregulares en español",
        url: "https://example.com/video4.mp4",
        thumbnail:
          "https://via.placeholder.com/300x200/10B981/FFFFFF?text=Lengua",
        duration: 1500,
        subject: "Lengua",
        level: "ESO",
        year: "4º ESO",
        progress: 30,
        views: 980,
        likes: 72,
        rating: 4.4,
        subtitles: true,
        transcript: "Los verbos irregulares son fundamentales en el español...",
        tags: ["gramática", "verbos", "español", "lengua"],
        createdAt: new Date("2024-02-01"),
        instructor: "Prof. Laura Ruiz",
      },
      {
        id: "5",
        title: "English Grammar: Present Perfect",
        description: "Complete guide to the present perfect tense in English",
        url: "https://example.com/video5.mp4",
        thumbnail:
          "https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Inglés",
        duration: 1100,
        subject: "Inglés",
        level: "Bachillerato",
        year: "1º Bachillerato",
        progress: 60,
        views: 1450,
        likes: 95,
        rating: 4.7,
        subtitles: true,
        transcript: "The present perfect tense is used to describe...",
        tags: ["gramática", "present perfect", "inglés", "tiempos verbales"],
        createdAt: new Date("2024-02-05"),
        instructor: "Prof. John Smith",
      },
    ];

    return this.applyFilters(mockVideos, filters);
  }
}
