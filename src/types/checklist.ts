export interface ChecklistProgress {
  totalPhases: number;
  completedPhases: number;
  currentPhase: number;
  currentPhaseName: string;
  totalItems: number;
  completedItems: number;
  overallProgress: number;
}

export interface ChecklistProgressResponse {
  message: string;
  progress: ChecklistProgress;
}

export interface ChecklistItem {
  id: string;
  name: string;
  completed: boolean;
  description?: string;
}

export interface ChecklistPhase {
  id: string;
  name: string;
  completed: boolean;
  items: ChecklistItem[];
}

export interface Checklist {
  id: string;
  businessId: string;
  currentPhase: number;
  phases: ChecklistPhase[];
}

// Enum para las fases del proceso según el orden.txt
export enum OnboardingPhase {
  HANDOFF = 0,
  ACTIVATION_ONBOARDING = 1,
  STRATEGY_FUNNEL_DESIGN = 2,
  IMPLEMENTATION_LAUNCH = 3,
  PERFORMANCE_TRANSITION = 4
}

// Mapeo de fases a responsables para agendar reuniones
export const PHASE_MEETING_MAPPING = {
  [OnboardingPhase.ACTIVATION_ONBOARDING]: 'denisse', // Marketing
  [OnboardingPhase.STRATEGY_FUNNEL_DESIGN]: 'luis', // Estratega de datos
  [OnboardingPhase.IMPLEMENTATION_LAUNCH]: 'denisse', // Marketing
  [OnboardingPhase.PERFORMANCE_TRANSITION]: 'diego' // Soporte técnico
} as const;

export type MeetingResponsible = typeof PHASE_MEETING_MAPPING[keyof typeof PHASE_MEETING_MAPPING];