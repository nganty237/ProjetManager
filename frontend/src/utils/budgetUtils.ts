import { Expense, ExpenseCategory, Project } from '@/types';

// ===== Calculs financiers =====

/** Somme totale des dépenses d'un tableau d'Expense */
export function getTotalExpenses(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0);
}

/** Budget restant = alloué - dépensé */
export function getBudgetRemaining(allocated: number, expenses: Expense[]): number {
  return allocated - getTotalExpenses(expenses);
}

/** Taux de consommation en pourcentage (0–∞, peut dépasser 100) */
export function getBudgetConsumptionRate(allocated: number, expenses: Expense[]): number {
  if (!allocated || allocated === 0) return 0;
  return (getTotalExpenses(expenses) / allocated) * 100;
}

/** Statut visuel du budget selon le taux de consommation */
export type BudgetStatus = 'none' | 'healthy' | 'warning' | 'danger' | 'exceeded';

export function getBudgetStatus(allocated: number | undefined, expenses: Expense[]): BudgetStatus {
  if (!allocated) return 'none';
  const rate = getBudgetConsumptionRate(allocated, expenses);
  if (rate >= 100) return 'exceeded';
  if (rate >= 80) return 'danger';
  if (rate >= 60) return 'warning';
  return 'healthy';
}

/** Couleur de la barre de progression selon le statut */
export function getBudgetBarColor(status: BudgetStatus): string {
  switch (status) {
    case 'exceeded': return 'bg-red-600';
    case 'danger':   return 'bg-red-500';
    case 'warning':  return 'bg-amber-500';
    case 'healthy':  return 'bg-emerald-500';
    default:         return 'bg-slate-300';
  }
}

/** Couleur du texte selon le statut */
export function getBudgetTextColor(status: BudgetStatus): string {
  switch (status) {
    case 'exceeded': return 'text-red-700';
    case 'danger':   return 'text-red-600';
    case 'warning':  return 'text-amber-600';
    case 'healthy':  return 'text-emerald-700';
    default:         return 'text-slate-400';
  }
}

/** Répartition des dépenses par catégorie */
export function getExpensesByCategory(expenses: Expense[]): Record<ExpenseCategory, number> {
  const result: Record<ExpenseCategory, number> = {
    personnel: 0,
    software: 0,
    hardware: 0,
    subcontracting: 0,
    marketing: 0,
    travel: 0,
    other: 0,
  };
  for (const e of expenses) {
    result[e.category] = (result[e.category] || 0) + e.amount;
  }
  return result;
}

/** Statistiques financières globales du portefeuille */
export interface PortfolioFinancials {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  consumptionRate: number;
  projectsWithBudget: number;
  projectsOverBudget: number;
  projectsInWarning: number;
}

export function getPortfolioFinancials(projects: Project[]): PortfolioFinancials {
  let totalAllocated = 0;
  let totalSpent = 0;
  let projectsWithBudget = 0;
  let projectsOverBudget = 0;
  let projectsInWarning = 0;

  for (const p of projects) {
    const expenses = p.expenses || [];
    const spent = getTotalExpenses(expenses);
    totalSpent += spent;

    if (p.budget?.allocated) {
      const alloc = p.budget.allocated;
      totalAllocated += alloc;
      projectsWithBudget++;
      const rate = getBudgetConsumptionRate(alloc, expenses);
      if (rate >= 100) projectsOverBudget++;
      else if (rate >= 80) projectsInWarning++;
    }
  }

  const consumptionRate = totalAllocated > 0 ? (totalSpent / totalAllocated) * 100 : 0;
  return {
    totalAllocated,
    totalSpent,
    totalRemaining: totalAllocated - totalSpent,
    consumptionRate,
    projectsWithBudget,
    projectsOverBudget,
    projectsInWarning,
  };
}
