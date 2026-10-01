import React from 'react';
import { ProjectStatus, ProjectPriority } from '@/types';
import { 
  Rocket, 
  CheckCircle2, 
  Archive,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Flame
} from 'lucide-react';

// Constantes des couleurs de statuts de projets
export const STATUS_COLORS = {
  active: '#2563EB',
  completed: '#16A34A',
  archived: '#64748B',
} as const;

// Configuration des 3 statuts de projets
export const statusConfig: Record<
  ProjectStatus,
  { label: string; color: string; bgColor: string; dotBg: string; hex: string; icon: React.ReactNode }
> = {
  active: {
    label: 'En cours',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    dotBg: 'bg-blue-600',
    hex: '#2563EB',
    icon: <Rocket size={14} />,
  },
  completed: {
    label: 'Terminé',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    dotBg: 'bg-emerald-600',
    hex: '#16A34A',
    icon: <CheckCircle2 size={14} />,
  },
  archived: {
    label: 'Archivé',
    color: 'text-slate-500',
    bgColor: 'bg-slate-100',
    dotBg: 'bg-slate-400',
    hex: '#64748B',
    icon: <Archive size={14} />,
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
    bgColor: 'bg-slate-100',
    dotBg: 'bg-slate-400',
    hex: '#64748B',
  },
  'in-progress': {
    label: 'En cours',
    color: 'text-[#2563EB]',
    bgColor: 'bg-[#2563EB]/10',
    dotBg: 'bg-[#2563EB]',
    hex: '#2563EB',
  },
  review: {
    label: 'En révision',
    color: 'text-[#D97706]',
    bgColor: 'bg-[#D97706]/10',
    dotBg: 'bg-[#D97706]',
    hex: '#D97706',
  },
  done: {
    label: 'Terminé',
    color: 'text-[#16A34A]',
    bgColor: 'bg-[#16A34A]/10',
    dotBg: 'bg-[#16A34A]',
    hex: '#16A34A',
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
  if (!endDate || status === 'completed' || status === 'archived') return false;
  const end = typeof endDate === 'string' ? new Date(endDate) : endDate;
  return new Date() > end;
};
