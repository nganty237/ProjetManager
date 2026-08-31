import { ExpenseCategory } from '@/types';
import { Banknote, Users, Monitor, Wrench, Megaphone, Plane, MoreHorizontal } from 'lucide-react';
import React from 'react';

// ===== Configuration des catégories de dépenses =====

export interface ExpenseCategoryConfig {
  label: string;
  color: string;       // text color class
  bgColor: string;     // background color class
  borderColor: string; // border color class
  barColor: string;    // solid color for charts (hex/tailwind bg)
  icon: React.ReactNode;
}

export const expenseCategoryConfig: Record<ExpenseCategory, ExpenseCategoryConfig> = {
  personnel: {
    label: 'Personnel',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    barColor: 'bg-blue-500',
    icon: React.createElement(Users, { size: 14 }),
  },
  software: {
    label: 'Logiciels',
    color: 'text-violet-700',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    barColor: 'bg-violet-500',
    icon: React.createElement(Monitor, { size: 14 }),
  },
  hardware: {
    label: 'Matériel',
    color: 'text-slate-700',
    bgColor: 'bg-slate-100',
    borderColor: 'border-slate-300',
    barColor: 'bg-slate-500',
    icon: React.createElement(Wrench, { size: 14 }),
  },
  subcontracting: {
    label: 'Sous-traitance',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    barColor: 'bg-orange-500',
    icon: React.createElement(Banknote, { size: 14 }),
  },
  marketing: {
    label: 'Marketing',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    barColor: 'bg-pink-500',
    icon: React.createElement(Megaphone, { size: 14 }),
  },
  travel: {
    label: 'Déplacements',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    barColor: 'bg-teal-500',
    icon: React.createElement(Plane, { size: 14 }),
  },
  other: {
    label: 'Autres',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    barColor: 'bg-slate-400',
    icon: React.createElement(MoreHorizontal, { size: 14 }),
  },
};

// ===== Formatage FCFA =====

/**
 * Formate un montant en FCFA avec séparateurs de milliers.
 * Exemple : 1500000 → "1 500 000 FCFA"
 */
export function formatFCFA(amount: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XOF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formate un montant compact pour les grands nombres.
 * Exemple : 1500000 → "1,5M FCFA" | 150000 → "150K FCFA"
 */
export function formatFCFACompact(amount: number): string {
  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1).replace('.0', '')}M FCFA`;
  }
  if (amount >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K FCFA`;
  }
  return `${amount} FCFA`;
}
