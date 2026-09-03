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
    <div className="rounded-md border border-slate-200 bg-white p-5 space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
          Synthèse du Budget
        </h4>
        {allocated > 0 && (
          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
            status === 'exceeded'
              ? 'bg-rose-50 text-rose-700 border-rose-200'
              : status === 'danger'
              ? 'bg-amber-50 text-amber-700 border-amber-200'
              : status === 'warning'
              ? 'bg-amber-50 text-amber-600 border-amber-200'
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {status === 'exceeded' ? 'Budget dépassé' : status === 'danger' ? 'Alerte budget' : status === 'warning' ? 'Attention' : 'Budget sain'}
          </span>
        )}
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 rounded-md border border-slate-200 p-3.5 flex flex-col justify-between">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Budget Alloué</p>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
            {allocated > 0 ? formatFCFA(allocated) : 'Non défini'}
          </p>
        </div>
        <div className="bg-slate-50 rounded-md border border-slate-200 p-3.5 flex flex-col justify-between">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Total Dépensé</p>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 mt-1">
            {formatFCFA(total)}
          </p>
        </div>
        <div className="bg-slate-50 rounded-md border border-slate-200 p-3.5 flex flex-col justify-between">
          <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Solde Restant</p>
          <p className={`text-base sm:text-lg font-extrabold mt-1 ${remaining < 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {allocated > 0 ? formatFCFA(remaining) : '—'}
          </p>
        </div>
      </div>

      {/* Barre de progression */}
      {allocated > 0 ? (
        <div className="pt-2">
          <div className="flex justify-between items-center text-xs text-slate-600 mb-1.5 font-medium">
            <span>Taux de consommation</span>
            <span className="font-extrabold text-slate-900">{rate.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${barColor}`}
              style={{ width: `${Math.min(rate, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-400 mt-1.5 font-medium">
            <span>0 FCFA</span>
            <span>{formatFCFA(allocated)}</span>
          </div>
        </div>
      ) : (
        <div className="text-center py-3 bg-slate-50 border border-dashed border-slate-200 rounded-md text-xs text-slate-400 font-medium">
          Aucun budget alloué. Les dépenses sont actuellement enregistrées hors budget.
        </div>
      )}
    </div>
  );
}

export default BudgetOverview;
