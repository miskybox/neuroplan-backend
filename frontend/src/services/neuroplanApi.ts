import api from './api';
import type {
  Student,
  Report,
  PEI,
  AudioFile,
  ResourceLink,
  WorkflowExecution,
  CreateStudentDTO,
  GeneratePEIDTO,
  UpdatePEIStatusDTO,
  TextToSpeechDTO,
  SearchResourcesDTO,
  TriggerWorkflowDTO,
  ApiResponse,
} from '../types/api';

// Students & Reports Service
export const studentsService = {
  // Crear estudiante
  create: (data: CreateStudentDTO): Promise<ApiResponse<Student>> =>
    api.post('/upload/students', data).then(res => res.data),

  // Listar estudiantes
  getAll: (): Promise<ApiResponse<Student[]>> =>
    api.get('/upload/students').then(res => res.data),

  // Obtener estudiante por ID
  getById: (id: number): Promise<ApiResponse<Student>> =>
    api.get(`/upload/students/${id}`).then(res => res.data),

  // Subir reporte médico
  uploadReport: (studentId: number, file: File): Promise<ApiResponse<Report>> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('studentId', String(studentId)); // Enviar studentId como string en FormData
    
    // DEBUG: Verificar FormData
    console.log('📤 Subiendo reporte con studentId:', studentId, 'tipo:', typeof String(studentId));
    
    return api.post(`/upload/reports`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(res => res.data);
  },

  // Descargar reporte
  downloadReport: (reportId: number): Promise<Blob> =>
    api.get(`/upload/reports/${reportId}/download`, {
      responseType: 'blob',
    }).then(res => res.data),
};

// PEIs Service
export const peisService = {
  // Generar PEI desde reporte
  generate: (data: GeneratePEIDTO): Promise<ApiResponse<PEI>> =>
    api.post('/peis/generate', data).then(res => res.data),

  // Listar PEIs
  getAll: (filters?: { status?: string; studentId?: number }): Promise<ApiResponse<PEI[]>> =>
    api.get('/peis', { params: filters }).then(res => res.data),

  // Obtener PEI por ID
  getById: (id: number): Promise<ApiResponse<PEI>> =>
    api.get(`/peis/${id}`).then(res => res.data),

  // Actualizar estado del PEI
  updateStatus: (id: number, data: UpdatePEIStatusDTO): Promise<ApiResponse<PEI>> =>
    api.patch(`/peis/${id}/status`, data).then(res => res.data),

  // Descargar PEI como PDF
  downloadPDF: (id: number): Promise<Blob> =>
    api.get(`/peis/${id}/pdf`, {
      responseType: 'blob',
    }).then(res => res.data),
};

// ElevenLabs Service
export const audioService = {
  // Convertir texto a audio
  textToSpeech: (data: TextToSpeechDTO): Promise<ApiResponse<AudioFile>> =>
    api.post('/elevenlabs/text-to-speech', data).then(res => res.data),

  // Generar audio completo del PEI
  generatePEIAudio: (peiId: number): Promise<ApiResponse<AudioFile>> =>
    api.post(`/elevenlabs/pei/${peiId}/audio`).then(res => res.data),

  // Generar resumen en audio del PEI
  generatePEISummaryAudio: (peiId: number): Promise<ApiResponse<AudioFile>> =>
    api.get(`/elevenlabs/pei/${peiId}/summary-audio`).then(res => res.data),

  // Listar voces disponibles
  getVoices: (): Promise<ApiResponse<any[]>> =>
    api.get('/elevenlabs/voices').then(res => res.data),
};

// Linkup Service
export const resourcesService = {
  // Buscar recursos educativos
  search: (data: SearchResourcesDTO): Promise<ApiResponse<ResourceLink[]>> =>
    api.post('/linkup/search', data).then(res => res.data),

  // Obtener recursos recomendados para un PEI
  getForPEI: (peiId: number): Promise<ApiResponse<ResourceLink[]>> =>
    api.get(`/linkup/pei/${peiId}/resources`).then(res => res.data),

  // Búsqueda rápida
  quickSearch: (query: string): Promise<ApiResponse<ResourceLink[]>> =>
    api.get(`/linkup/search/${encodeURIComponent(query)}`).then(res => res.data),
};

// n8n Service
export const workflowService = {
  // Disparar workflow personalizado
  trigger: (data: TriggerWorkflowDTO): Promise<ApiResponse<WorkflowExecution>> =>
    api.post('/n8n/trigger-workflow', data).then(res => res.data),

  // Notificar generación de PEI
  notifyPEIGenerated: (peiId: number): Promise<ApiResponse<WorkflowExecution>> =>
    api.post(`/n8n/pei/${peiId}/generated`).then(res => res.data),

  // Notificar aprobación de PEI
  notifyPEIApproved: (peiId: number): Promise<ApiResponse<WorkflowExecution>> =>
    api.post(`/n8n/pei/${peiId}/approved`).then(res => res.data),

  // Obtener estadísticas de workflows
  getStats: (): Promise<ApiResponse<any>> =>
    api.get('/n8n/stats').then(res => res.data),
};

// Health Check Service
export const healthService = {
  // Verificar estado del servidor (endpoint sin prefijo /api)
  check: async (): Promise<ApiResponse<{ status: string; timestamp: string }>> => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:3001';
    const response = await fetch(`${baseUrl}/health`);
    const data = await response.json();
    return {
      data,
      status: response.status,
    };
  },
};

// AWS Bedrock Service
export const bedrockService = {
  // Listar modelos disponibles
  getModels: (): Promise<ApiResponse<any[]>> =>
    api.get('/aws/bedrock/models').then(res => res.data),

  // Simplificar contenido con Bedrock
  simplifyContent: (data: { text: string; targetLevel?: string }): Promise<ApiResponse<any>> =>
    api.post('/aws/bedrock/simplify-content', data).then(res => res.data),

  // Generar PEI completo con Bedrock
  generatePEI: (data: {
    diagnosis: string[];
    symptoms: string[];
    strengths: string[];
    studentName: string;
    gradeLevel: string;
  }): Promise<ApiResponse<any>> =>
    api.post('/aws/bedrock/generate-pei', data).then(res => res.data),
};

// Auth Service (si se implementa más adelante)
export const authService = {
  // Login placeholder (para futura implementación)
  login: (email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> =>
    api.post('/auth/login', { email, password }).then(res => res.data),

  // Register placeholder
  register: (userData: any): Promise<ApiResponse<{ token: string; user: any }>> =>
    api.post('/auth/register', userData).then(res => res.data),

  // Logout
  logout: (): Promise<void> => {
    localStorage.removeItem('authToken');
    return Promise.resolve();
  },
};