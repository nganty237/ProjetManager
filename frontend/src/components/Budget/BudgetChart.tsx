import { Expense, ExpenseCategory, ProjectBudget } from '@/types';
import { expenseCategoryConfig, formatFCFA } from '@/utils/budgetConstants';
import { getTotalExpenses, getExpensesByCategory } from '@/utils/budgetUtils';

interface BudgetChartProps {
  expenses: Expense[];
  budget?: ProjectBudget;
}

/**
 * Répartition des dépenses par catégorie — barres horizontales CSS, pas de lib externe.
 */
export function BudgetChart({ expenses, budget }: BudgetChartProps) {
  const byCategory = getExpensesByCategory(expenses);
  const total = getTotalExpenses(expenses);

  // Seules les catégories avec des dépenses
  const activeCategories = (Object.keys(byCategory) as ExpenseCategory[]).filter(
    (cat) => byCategory[cat] > 0
  );

  if (activeCategories.length === 0) {
    return (
      <div className="flex items-center justify-center h-24 text-slate-400 text-xs font-medium border border-dashed border-slate-200 rounded-md">
        Aucune dépense enregistrée
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activeCategories.map((cat) => {
        const config = expenseCategoryConfig[cat];
        const amount = byCategory[cat];
        const pct = total > 0 ? (amount / total) * 100 : 0;
        return (
          <div key={cat}>
            <div className="flex items-center justify-between mb-1 text-xs">
              <span className={`flex items-center gap-1.5 font-semibold ${config.color}`}>
                {config.icon}
                {config.label}
              </span>
              <span className="font-bold text-slate-700">
                {formatFCFA(amount)}
                <span className="font-normal text-slate-400 ml-1.5">({pct.toFixed(0)}%)</span>
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-sm overflow-hidden">
              <div
                className={`h-full rounded-sm transition-all duration-500 ${config.barColor}`}
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
          </div>
        );
      })}

      {budget?.allocated && (
        <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
          <span>Budget alloué</span>
          <span className="font-bold text-slate-700">{formatFCFA(budget.allocated)}</span>
        </div>
      )}
    </div>
  );
}

export default BudgetChart;
