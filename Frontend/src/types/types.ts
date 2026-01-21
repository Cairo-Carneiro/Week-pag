/**
 * Types and Interfaces for Week Page Application
 * Centralized type definitions for type safety across the app
 */

// ============================================
// ENUMS & LITERAL TYPES
// ============================================

/**
 * Status types for palestras (lectures)
 * - confirmado: Lecture is confirmed and ready
 * - atenção: Needs attention (missing confirmations, materials, etc.)
 * - pendente: Pending confirmation or setup
 */
export type StatusType = 'confirmado' | 'atenção' | 'pendente';

/**
 * View modes for displaying palestras
 * - list: Traditional list view
 * - calendar-week: Weekly calendar view
 * - calendar-month: Monthly calendar view
 */
export type ViewMode = 'list' | 'calendar-week' | 'calendar-month';

// ============================================
// MAIN DATA MODELS
// ============================================

/**
 * Palestra (Lecture/Presentation) model
 * Represents a scheduled lecture/presentation in the integration program
 */
export interface Palestra {
  id: string;
  titulo: string;           // Lecture title
  dia: string;              // Day of week (e.g., "Segunda-feira")
  data: string;             // Date in format "DD/MM" or ISO string
  horario: string;          // Time range (e.g., "09:00 - 11:00")
  local: string;            // Location/room
  publico: string;          // Target audience
  status: StatusType;       // Current status
  observacao?: string;      // Optional notes/observations
  createdAt?: string;       // ISO timestamp of creation
  updatedAt?: string;       // ISO timestamp of last update
}

/**
 * Responsabilidade (Responsibility/Task) model
 * Represents an action item or responsibility for the week
 */
export interface Responsabilidade {
  id: string;
  texto: string;            // Task description
  critico: boolean;         // Whether this is a critical/urgent task
  completo: boolean;        // Whether the task is completed
  createdAt?: string;       // ISO timestamp of creation
}

/**
 * Orientação (Guidance/Tip) model
 * Represents helpful tips and guidance for presenters
 */
export interface Orientacao {
  id: string;
  titulo: string;           // Tip title
  texto: string;            // Tip description
  icone: string;            // Icon name (from lucide-react)
}

/**
 * Avaliação (Evaluation) model
 * Represents effectiveness metrics for the integration program
 */
export interface Avaliacao {
  nota: number;             // Rating (e.g., 4.6)
  total: number;            // Maximum rating (e.g., 5)
  periodo: string;          // Evaluation period (e.g., "últimos 3 meses")
}

/**
 * Usuario (User) model
 * Basic user information for authentication (future backend integration)
 */
export interface Usuario {
  id: string;
  nome: string;
  email: string;
  perfil?: 'Facilitador' | 'Gestor' | 'Administrador';
  role?: 'admin' | 'presenter' | 'viewer';
}

/**
 * EventoOnboarding model
 * Represents an onboarding event shown on the initial landing page
 */
export interface EventoOnboarding {
  id: string;
  horario: string;          // Time range (e.g., "09:00 – 10:30")
  local: string;            // Location/room
  tipo: string;             // Event type (e.g., "Novos Colaboradores")
  participante: string;     // Participant name
  data?: string;            // Optional date
  coordenadas?: {           // Optional map coordinates
    lat: number;
    lng: number;
  };
}

// ============================================
// FILTER & SEARCH TYPES
// ============================================

/**
 * Filter options for palestras
 */
export interface PalestraFilters {
  status?: StatusType | 'todos';
  dataInicio?: string;      // ISO date string
  dataFim?: string;         // ISO date string
  searchQuery?: string;     // Search by title
}

/**
 * Sort options for palestras
 */
export type SortBy = 'data' | 'titulo' | 'status';
export type SortOrder = 'asc' | 'desc';

export interface SortOptions {
  sortBy: SortBy;
  sortOrder: SortOrder;
}

// ============================================
// FORM TYPES
// ============================================

/**
 * Form data for creating/editing a palestra
 * Omits auto-generated fields like id, createdAt, updatedAt
 */
export type PalestraFormData = Omit<Palestra, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * Form data for creating a responsabilidade
 */
export type ResponsibilidadeFormData = Omit<Responsabilidade, 'id' | 'createdAt' | 'completo'>;

// ============================================
// API RESPONSE TYPES (for future backend integration)
// ============================================

/**
 * Generic API response wrapper
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Paginated response (for future use)
 */
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
