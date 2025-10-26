/**
 * Veed.io service for educational video management
 * This service handles video operations and provides mock data for development
 */

export interface VideoFilters {
  subject?: string;
  level?: string;
  search?: string;
}

export interface Video {
  id: number;
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

class VeedService {
  private baseUrl = 'https://api.veed.io'; // This would be the actual Veed API URL
  private apiKey = process.env.VITE_VEED_API_KEY; // API key from environment variables

  /**
   * Get videos with optional filters
   */
  async getVideos(filters: VideoFilters = {}): Promise<Video[]> {
    try {
      // In a real implementation, this would make an API call to Veed
      // For now, we'll return mock data that matches the filters
      const mockVideos: Video[] = [
        {
          id: 1,
          title: 'Introducción a las Ecuaciones de Segundo Grado',
          description: 'Aprende los conceptos básicos de las ecuaciones cuadráticas con ejemplos prácticos',
          url: 'https://example.com/video1.mp4',
          thumbnail: 'https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Matemáticas',
          duration: 1200, // 20 minutos
          subject: 'Matemáticas',
          level: 'ESO',
          year: '3º ESO',
          progress: 75,
          views: 1250,
          likes: 89,
          rating: 4.8,
          subtitles: true,
          transcript: 'En este video aprenderemos los conceptos básicos del álgebra...',
          tags: ['ecuaciones', 'álgebra', 'matemáticas', 'segundo grado'],
          createdAt: new Date('2024-01-15'),
          instructor: 'Prof. Ana Martínez'
        },
        {
          id: 2,
          title: 'Historia de España: Siglo XX',
          description: 'Repaso completo de los acontecimientos más importantes del siglo XX en España',
          url: 'https://example.com/video2.mp4',
          thumbnail: 'https://via.placeholder.com/300x200/DC2626/FFFFFF?text=Historia',
          duration: 1800, // 30 minutos
          subject: 'Historia',
          level: 'Bachillerato',
          year: '2º Bachillerato',
          progress: 45,
          views: 890,
          likes: 67,
          rating: 4.6,
          subtitles: true,
          transcript: 'El siglo XX fue un período de grandes cambios en España...',
          tags: ['historia', 'españa', 'siglo xx', 'guerra civil'],
          createdAt: new Date('2024-01-20'),
          instructor: 'Prof. Carlos López'
        },
        {
          id: 3,
          title: 'Fotosíntesis: Proceso Vital',
          description: 'Explicación detallada del proceso de fotosíntesis en las plantas',
          url: 'https://example.com/video3.mp4',
          thumbnail: 'https://via.placeholder.com/300x200/059669/FFFFFF?text=Ciencias',
          duration: 900, // 15 minutos
          subject: 'Ciencias',
          level: 'ESO',
          year: '2º ESO',
          progress: 100,
          views: 2100,
          likes: 156,
          rating: 4.9,
          subtitles: true,
          transcript: 'La fotosíntesis es el proceso por el cual las plantas...',
          tags: ['fotosíntesis', 'plantas', 'biología', 'ciencias naturales'],
          createdAt: new Date('2024-01-25'),
          instructor: 'Prof. María García'
        },
        {
          id: 4,
          title: 'Gramática Española: Verbos Irregulares',
          description: 'Estudio completo de los verbos irregulares en español',
          url: 'https://example.com/video4.mp4',
          thumbnail: 'https://via.placeholder.com/300x200/10B981/FFFFFF?text=Lengua',
          duration: 1500, // 25 minutos
          subject: 'Lengua',
          level: 'ESO',
          year: '4º ESO',
          progress: 30,
          views: 980,
          likes: 72,
          rating: 4.4,
          subtitles: true,
          transcript: 'Los verbos irregulares son fundamentales en el español...',
          tags: ['gramática', 'verbos', 'español', 'lengua'],
          createdAt: new Date('2024-02-01'),
          instructor: 'Prof. Laura Ruiz'
        },
        {
          id: 5,
          title: 'English Grammar: Present Perfect',
          description: 'Complete guide to the present perfect tense in English',
          url: 'https://example.com/video5.mp4',
          thumbnail: 'https://via.placeholder.com/300x200/8B5CF6/FFFFFF?text=Inglés',
          duration: 1100, // 18 minutos
          subject: 'Inglés',
          level: 'Bachillerato',
          year: '1º Bachillerato',
          progress: 60,
          views: 1450,
          likes: 95,
          rating: 4.7,
          subtitles: true,
          transcript: 'The present perfect tense is used to describe...',
          tags: ['gramática', 'present perfect', 'inglés', 'tiempos verbales'],
          createdAt: new Date('2024-02-05'),
          instructor: 'Prof. John Smith'
        }
      ];

      // Apply filters
      let filteredVideos = mockVideos;

      if (filters.subject) {
        filteredVideos = filteredVideos.filter(video => 
          video.subject.toLowerCase().includes(filters.subject!.toLowerCase())
        );
      }

      if (filters.level) {
        filteredVideos = filteredVideos.filter(video => 
          video.level.toLowerCase().includes(filters.level!.toLowerCase())
        );
      }

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredVideos = filteredVideos.filter(video => 
          video.title.toLowerCase().includes(searchTerm) ||
          video.description.toLowerCase().includes(searchTerm) ||
          video.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      return filteredVideos;
    } catch (error) {
      console.error('Error fetching videos from Veed API:', error);
      throw new Error('Failed to fetch videos');
    }
  }

  /**
   * Get a specific video by ID
   */
  async getVideoById(id: number): Promise<Video | null> {
    try {
      const videos = await this.getVideos();
      return videos.find(video => video.id === id) || null;
    } catch (error) {
      console.error('Error fetching video by ID:', error);
      return null;
    }
  }

  /**
   * Update video progress
   */
  async updateVideoProgress(videoId: number, progress: number): Promise<boolean> {
    try {
      // In a real implementation, this would update the progress in the database
      console.log(`Updating progress for video ${videoId} to ${progress}%`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return true;
    } catch (error) {
      console.error('Error updating video progress:', error);
      return false;
    }
  }

  /**
   * Like/unlike a video
   */
  async toggleVideoLike(videoId: number): Promise<boolean> {
    try {
      // In a real implementation, this would toggle the like status
      console.log(`Toggling like for video ${videoId}`);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return true;
    } catch (error) {
      console.error('Error toggling video like:', error);
      return false;
    }
  }

  /**
   * Get video transcript
   */
  async getVideoTranscript(videoId: number): Promise<string | null> {
    try {
      const video = await this.getVideoById(videoId);
      return video?.transcript || null;
    } catch (error) {
      console.error('Error fetching video transcript:', error);
      return null;
    }
  }
}

// Export a singleton instance
export const veedService = new VeedService();
