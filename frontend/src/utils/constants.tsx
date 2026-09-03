import React from 'react';
import { ProjectStatus, ProjectPriority } from '@/types';
import { 
  ClipboardList, 
  Rocket, 
  PauseCircle, 
  CheckCircle2, 
  XCircle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Flame
} from 'lucide-react';

// Configuration des statuts
export const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  planning: {
    label: 'Planification',
    color: 'text-blue-600',
    bgColor: '',
    icon: <ClipboardList size={14} />,
  },
  active: {
    label: 'En cours',
    color: 'text-emerald-600',
    bgColor: '',
    icon: <Rocket size={14} />,
  },
  'on-hold': {
    label: 'En pause',
    color: 'text-amber-600',
    bgColor: '',
    icon: <PauseCircle size={14} />,
  },
  completed: {
    label: 'Terminé',
    color: 'text-purple-600',
    bgColor: '',
    icon: <CheckCircle2 size={14} />,
  },
  cancelled: {
    label: 'Annulé',
    color: 'text-rose-600',
    bgColor: '',
    icon: <XCircle size={14} />,
  },
};

// Configuration des priorités
export const priorityConfig: Record<
  ProjectPriority,
  { label: string; color: string; bgColor: string; icon: React.ReactNode }
> = {
  low: {
    label: 'Basse',
    color: 'text-slate-500',
    bgColor: '',
    icon: <ArrowDown size={14} />,
  },
  medium: {
    label: 'Moyenne',
    color: 'text-blue-600',
    bgColor: '',
    icon: <ArrowRight size={14} />,
  },
  high: {
    label: 'Haute',
    color: 'text-amber-600',
    bgColor: '',
    icon: <ArrowUp size={14} />,
  },
  critical: {
    label: 'Critique',
    color: 'text-rose-600',
    bgColor: '',
    icon: <Flame size={14} />,
  },
};

// Configuration des statuts de tâches
export const taskStatusConfig = {
  todo: {
    label: 'À faire',
    color: 'text-slate-500',
    bgColor: '',
  },
  'in-progress': {
    label: 'En cours',
    color: 'text-blue-600',
    bgColor: '',
  },
  review: {
    label: 'En révision',
    color: 'text-amber-600',
    bgColor: '',
  },
  done: {
    label: 'Terminé',
    color: 'text-emerald-600',
    bgColor: '',
  },
};

// Fonction utilitaire pour formatter la date
export const formatDate = (date: Date | string): string => {
  if (!date) return '';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(d);
};

// Fonction pour calculer les jours restants
export const getDaysRemaining = (endDate: Date | string): number => {
  if (!endDate) return 0;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  const now = new Date();
  const diff = end.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Fonction pour vérifier si un projet est en retard
export const isOverdue = (endDate?: Date | string, status?: ProjectStatus): boolean => {
  if (!endDate || status === 'completed' || status === 'cancelled') return false;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return new Date() > end;
};
