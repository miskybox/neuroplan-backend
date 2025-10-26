// Enums
export enum ReportType {
  MEDICAL = 'MEDICAL',
  PSYCHOLOGICAL = 'PSYCHOLOGICAL',
  EDUCATIONAL = 'EDUCATIONAL',
  OTHER = 'OTHER'
}

export enum PEIStatus {
  DRAFT = 'draft',
  PENDING_REVIEW = 'pending_review',
  APPROVED = 'approved',
  IN_IMPLEMENTATION = 'in_implementation',
  ARCHIVED = 'archived'
}

export enum AudioType {
  FULL_PEI = 'full_pei',
  SUMMARY = 'summary',
  SECTION = 'section'
}

export enum WorkflowStatus {
  PENDING = 'pending',
  RUNNING = 'running',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// Interfaces principales
export interface Student {
  id: number;
  name: string;
  dateOfBirth: string;
  gradeLevel: string;
  diagnosis?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  reports?: Report[];
  peis?: PEI[];
}

export interface Report {
  id: number;
  studentId: number;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
  type: ReportType;
  uploadedAt: string;
  processedAt?: string;
  extractedText?: string;
  student?: Student;
}

export interface PEI {
  id: number;
  studentId: number;
  reportId: number;
  content: any; // JSON object con la estructura del PEI
  status: PEIStatus;
  generatedAt: string;
  lastModified: string;
  student?: Student;
  report?: Report;
  audioFiles?: AudioFile[];
  resourceLinks?: ResourceLink[];
}

export interface AudioFile {
  id: number;
  peiId: number;
  filename: string;
  originalText: string;
  type: AudioType;
  voiceId: string;
  duration: number;
  size: number;
  createdAt: string;
  pei?: PEI;
}

export interface ResourceLink {
  id: number;
  peiId: number;
  title: string;
  url: string;
  description?: string;
  category: string;
  difficulty?: string;
  rating?: number;
  popularity?: number;
  createdAt: string;
  pei?: PEI;
}

export interface WorkflowExecution {
  id: number;
  workflowName: string;
  status: WorkflowStatus;
  inputData: any;
  outputData?: any;
  executedAt: string;
  completedAt?: string;
  duration?: number;
  errorMessage?: string;
}

export interface ActivityLog {
  id: number;
  actor: string;
  action: string;
  entityType?: string;
  entityId?: number;
  details?: any;
  timestamp: string;
}

// DTOs para requests
export interface CreateStudentDTO {
  name: string;
  dateOfBirth: string;
  gradeLevel: string;
  diagnosis?: string;
  notes?: string;
}

export interface GeneratePEIDTO {
  reportId: number;
  studentId?: number | string; // Opcional, puede ser number o string
}

export interface UpdatePEIStatusDTO {
  status: PEIStatus;
}

export interface TextToSpeechDTO {
  text: string;
  voiceId?: string;
  stability?: number;
  similarityBoost?: number;
}

export interface SearchResourcesDTO {
  query: string;
  filters?: {
    category?: string;
    difficulty?: string;
    minRating?: number;
  };
  limit?: number;
}

export interface TriggerWorkflowDTO {
  workflowName: string;
  data: any;
}

// Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Error response
export interface ApiError {
  message: string;
  statusCode: number;
  timestamp: string;
  path: string;
  details?: any;
}