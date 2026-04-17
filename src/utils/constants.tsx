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
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: <ClipboardList size={14} />,
  },
  active: {
    label: 'En cours',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
    icon: <Rocket size={14} />,
  },
  'on-hold': {
    label: 'En pause',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
    icon: <PauseCircle size={14} />,
  },
  completed: {
    label: 'Terminé',
    color: 'text-purple-700',
    bgColor: 'bg-purple-100',
    icon: <CheckCircle2 size={14} />,
  },
  cancelled: {
    label: 'Annulé',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
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
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
    icon: <ArrowDown size={14} />,
  },
  medium: {
    label: 'Moyenne',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
    icon: <ArrowRight size={14} />,
  },
  high: {
    label: 'Haute',
    color: 'text-orange-700',
    bgColor: 'bg-orange-100',
    icon: <ArrowUp size={14} />,
  },
  critical: {
    label: 'Critique',
    color: 'text-red-700',
    bgColor: 'bg-red-100',
    icon: <Flame size={14} />,
  },
};

// Configuration des statuts de tâches
export const taskStatusConfig = {
  todo: {
    label: 'À faire',
    color: 'text-gray-700',
    bgColor: 'bg-gray-100',
  },
  'in-progress': {
    label: 'En cours',
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  review: {
    label: 'En révision',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  done: {
    label: 'Terminé',
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
};

// Fonction utilitaire pour formatter la date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

// Fonction pour calculer les jours restants
export const getDaysRemaining = (endDate: Date): number => {
  const now = new Date();
  const diff = endDate.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

// Fonction pour vérifier si un projet est en retard
export const isOverdue = (endDate?: Date, status?: ProjectStatus): boolean => {
  if (!endDate || status === 'completed' || status === 'cancelled') return false;
  return new Date() > endDate;
};
