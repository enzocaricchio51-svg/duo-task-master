export type TaskStatus = 'pending' | 'progress' | 'review' | 'complete';
export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskResponsible = 'Yo' | 'Mi Socio';

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  description: string;
  responsible: TaskResponsible;
  priority: TaskPriority;
  dueDate: string;
  project: string;
  comments: TaskComment[];
  createdAt: string;
  updatedAt: string;
}

export interface TaskComment {
  id: string;
  date: string;
  text: string;
}

export interface TaskFilters {
  status?: TaskStatus[];
  responsible?: TaskResponsible[];
  priority?: TaskPriority[];
  project?: string;
}

export const TASK_STATUS_CONFIG = {
  pending: {
    label: 'Pendiente',
    emoji: '⚪',
    color: 'status-pending'
  },
  progress: {
    label: 'En Proceso',
    emoji: '🟡',
    color: 'status-progress'
  },
  review: {
    label: 'En Revisión',
    emoji: '🔵',
    color: 'status-review'
  },
  complete: {
    label: 'Completada',
    emoji: '✅',
    color: 'status-complete'
  }
} as const;

export const TASK_PRIORITY_CONFIG = {
  high: {
    label: 'Alta',
    emoji: '🔥',
    color: 'priority-high'
  },
  medium: {
    label: 'Media',
    emoji: '⭐',
    color: 'priority-medium'
  },
  low: {
    label: 'Baja',
    emoji: '❄️',
    color: 'priority-low'
  }
} as const;