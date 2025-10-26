import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Video, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Download, 
  BookOpen, 
  FileText, 
  Image, 
  Search, 
  Filter, 
  Clock, 
  Star, 
  Eye, 
  ThumbsUp,
  Share2,
  Bookmark,
  BookmarkCheck,
  RotateCcw,
  Maximize,
  Minimize,
  Settings
} from 'lucide-react';
import { useVoice } from '@/hooks/use-voice';
import { veedService } from '@/services/veed';

/**
 * Página de recursos educativos
 * Visualización de videos educativos generados por Veed.io, esquemas y lecturas
 */
export const EducationalResources: React.FC = () => {
  const { speak, isSpeaking, stopSpeaking } = useVoice();
  const [activeTab, setActiveTab] = useState('videos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [videos, setVideos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Datos mock de recursos educativos
  const [mockVideos] = useState([
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
    }
  ]);

  const [mockDocuments] = useState([
    {
      id: 1,
      title: 'Guía de Estudio: Álgebra Básica',
      description: 'Resumen completo de conceptos algebraicos fundamentales',
      type: 'pdf',
      subject: 'Matemáticas',
      level: 'ESO',
      pages: 25,
      downloads: 450,
      rating: 4.7,
      url: '/documents/algebra-basica.pdf',
      thumbnail: 'https://via.placeholder.com/200x280/4F46E5/FFFFFF?text=PDF'
    },
    {
      id: 2,
      title: 'Esquema: Períodos Históricos',
      description: 'Mapa conceptual de los principales períodos históricos',
      type: 'image',
      subject: 'Historia',
      level: 'Bachillerato',
      downloads: 320,
      rating: 4.5,
      url: '/images/esquema-historia.jpg',
      thumbnail: 'https://via.placeholder.com/200x280/DC2626/FFFFFF?text=Esquema'
    }
  ]);

  const subjects = ['Matemáticas', 'Lengua', 'Historia', 'Ciencias', 'Inglés', 'Arte'];
  const levels = ['ESO', 'Bachillerato', 'FP', 'Universidad'];

  useEffect(() => {
    loadVideos();
  }, [searchTerm, selectedSubject, selectedLevel]);

  const loadVideos = async () => {
    setIsLoading(true);
    try {
      // En una implementación real, esto haría una llamada a la API de Veed
      const filters = {
        subject: selectedSubject,
        level: selectedLevel,
        search: searchTerm
      };
      
      const fetchedVideos = await veedService.getVideos(filters);
      setVideos(fetchedVideos);
    } catch (error) {
      console.error('Error loading videos:', error);
      // Fallback a datos mock
      setVideos(mockVideos);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReadAloud = (text: string) => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  const handlePlayVideo = (video: any) => {
    setCurrentVideo(video);
    setIsPlaying(true);
    setDuration(video.duration);
  };

  const handlePauseVideo = () => {
    setIsPlaying(false);
  };

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (newVolume === 0) {
      setIsMuted(true);
    } else {
      setIsMuted(false);
    }
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      setVolume(1);
    } else {
      setVolume(0);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
      'Matemáticas': 'bg-blue-100 text-blue-800',
      'Lengua': 'bg-green-100 text-green-800',
      'Historia': 'bg-red-100 text-red-800',
      'Ciencias': 'bg-emerald-100 text-emerald-800',
      'Inglés': 'bg-purple-100 text-purple-800',
      'Arte': 'bg-pink-100 text-pink-800'
    };
    return colors[subject] || 'bg-gray-100 text-gray-800';
  };

  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'ESO': 'bg-yellow-100 text-yellow-800',
      'Bachillerato': 'bg-orange-100 text-orange-800',
      'FP': 'bg-indigo-100 text-indigo-800',
      'Universidad': 'bg-violet-100 text-violet-800'
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Recursos Educativos</h1>
            <p className="text-muted-foreground">
              Videos educativos, documentos y materiales de estudio
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleReadAloud('Recursos educativos. Aquí puedes encontrar videos, documentos y materiales de estudio.')}
          >
            {isSpeaking ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Buscar recursos..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Materia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todas las materias</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Nivel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los niveles</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Video Player Modal */}
        {currentVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          >
            <div className="bg-background rounded-lg w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
              {/* Player Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <div>
                  <h2 className="text-xl font-semibold">{currentVideo.title}</h2>
                  <p className="text-muted-foreground">{currentVideo.instructor}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowSubtitles(!showSubtitles)}
                  >
                    {showSubtitles ? 'Ocultar' : 'Mostrar'} Subtítulos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                  >
                    {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentVideo(null)}
                  >
                    Cerrar
                  </Button>
                </div>
              </div>

              {/* Video Area */}
              <div className="flex-1 bg-black rounded-lg m-4 flex items-center justify-center">
                <div className="text-center text-white">
                  <Video className="w-16 h-16 mx-auto mb-4" />
                  <p>Reproductor de video</p>
                  <p className="text-sm text-gray-400">
                    En una implementación real, aquí se mostraría el video de Veed.io
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <div className="p-4 border-t space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatDuration(duration)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleTogglePlay}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleToggleMute}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </Button>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Velocidad:</span>
                      <Select value={playbackRate.toString()} onValueChange={(value) => setPlaybackRate(parseFloat(value))}>
                        <SelectTrigger className="w-20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0.5">0.5x</SelectItem>
                          <SelectItem value="0.75">0.75x</SelectItem>
                          <SelectItem value="1">1x</SelectItem>
                          <SelectItem value="1.25">1.25x</SelectItem>
                          <SelectItem value="1.5">1.5x</SelectItem>
                          <SelectItem value="2">2x</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Bookmark className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
          </TabsList>

          {/* Videos Tab */}
          <TabsContent value="videos" className="space-y-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Cargando videos...</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video, index) => (
                  <motion.div
                    key={video.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <Button
                            size="lg"
                            onClick={() => handlePlayVideo(video)}
                            className="rounded-full"
                          >
                            <Play className="w-6 h-6" />
                          </Button>
                        </div>
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary">
                            {formatDuration(video.duration)}
                          </Badge>
                        </div>
                        <div className="absolute bottom-2 left-2">
                          <Badge className={getSubjectColor(video.subject)}>
                            {video.subject}
                          </Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">
                          {video.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {video.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            <span>{video.views}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{video.rating}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{video.likes}</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progreso</span>
                            <span>{video.progress}%</span>
                          </div>
                          <Progress value={video.progress} className="h-2" />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            className="flex-1"
                            onClick={() => handlePlayVideo(video)}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            {video.progress > 0 ? 'Continuar' : 'Reproducir'}
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDocuments.map((document, index) => (
                <motion.div
                  key={document.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <div className="p-4">
                      <img
                        src={document.thumbnail}
                        alt={document.title}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <CardHeader className="p-0">
                        <CardTitle className="text-lg line-clamp-2">
                          {document.title}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {document.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-0 mt-4 space-y-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getSubjectColor(document.subject)}>
                            {document.subject}
                          </Badge>
                          <Badge className={getLevelColor(document.level)}>
                            {document.level}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Download className="w-4 h-4" />
                            <span>{document.downloads}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span>{document.rating}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button className="flex-1">
                            <Download className="w-4 h-4 mr-2" />
                            Descargar
                          </Button>
                          <Button variant="outline" size="sm">
                            <Bookmark className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Favorites Tab */}
          <TabsContent value="favorites" className="space-y-6">
            <div className="text-center py-12">
              <BookmarkCheck className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No hay favoritos aún</h3>
              <p className="text-muted-foreground">
                Marca recursos como favoritos para acceder a ellos rápidamente
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
