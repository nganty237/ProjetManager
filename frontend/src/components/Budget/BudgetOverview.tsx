import { Expense, ProjectBudget } from '@/types';
import { formatFCFA } from '@/utils/budgetConstants';
import {
  getTotalExpenses,
  getBudgetConsumptionRate,
  getBudgetStatus,
  getBudgetBarColor,
} from '@/utils/budgetUtils';

interface BudgetOverviewProps {
  expenses: Expense[];
  budget?: ProjectBudget;
  compact?: boolean;
}

/**
 * Carte résumé du budget : alloué, dépensé, restant, barre de consommation.
 * Design neutre et sobre — pas de fonds colorés dynamiques.
 */
export function BudgetOverview({ expenses, budget, compact = false }: BudgetOverviewProps) {
  const total = getTotalExpenses(expenses);
  const allocated = budget?.allocated ?? 0;
  const remaining = allocated - total;
  const rate = getBudgetConsumptionRate(allocated, expenses);
  const status = getBudgetStatus(allocated, expenses);
  const barColor = getBudgetBarColor(status);

  if (compact) {
    if (!budget?.allocated) return null;
    return (
      <div className="mt-2 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between text-[11px] mb-1">
          <span className="text-slate-500">Budget</span>
          <span className="font-bold text-slate-700">{rate.toFixed(0)}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
          <div
            className={`h-full rounded-sm ${barColor}`}
            style={{ width: `${Math.min(rate, 100)}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4">
      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-slate-50 rounded-md border border-slate-200 p-3 text-center">
          <p className="text-[11px] text-slate-500 mb-1 font-medium uppercase tracking-wider">Alloué</p>
          <p className="text-sm font-extrabold text-slate-900">
            {allocated > 0 ? formatFCFA(allocated) : '—'}
          </p>
        </div>
        <div className="bg-slate-50 rounded-md border border-slate-200 p-3 text-center">
          <p className="text-[11px] text-slate-500 mb-1 font-medium uppercase tracking-wider">Dépensé</p>
          <p className="text-sm font-extrabold text-slate-900">
            {formatFCFA(total)}
          </p>
        </div>
        <div className="bg-slate-50 rounded-md border border-slate-200 p-3 text-center">
          <p className="text-[11px] text-slate-500 mb-1 font-medium uppercase tracking-wider">Restant</p>
          <p className={`text-sm font-extrabold ${remaining < 0 ? 'text-red-600' : 'text-slate-900'}`}>
            {allocated > 0 ? formatFCFA(remaining) : '—'}
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      {allocated > 0 && (
        <div>
          <div className="flex justify-between text-[11px] text-slate-500 mb-1.5">
            <span>Consommation</span>
            <span className="font-bold text-slate-700">{rate.toFixed(1)}%{status === 'exceeded' ? ' — Dépassement !' : status === 'danger' ? ' — Alerte !' : ''}</span>
          </div>
          <div className="w-full h-2.5 bg-slate-100 border border-slate-200 rounded-sm overflow-hidden">
            <div
              className={`h-full rounded-sm transition-all duration-700 ${barColor}`}
              style={{ width: `${Math.min(rate, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1">
            <span>0 FCFA</span>
            <span>{formatFCFA(allocated)}</span>
          </div>
        </div>
      )}

      {!allocated && (
        <p className="text-xs text-slate-400 text-center py-2">Aucun budget défini pour ce projet</p>
      )}
    </div>
  );
}

export default BudgetOverview;
