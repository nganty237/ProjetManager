import { useProjectStore } from '@/store/projectStore';
import { useNavigate } from 'react-router-dom';
import { formatFCFACompact } from '@/utils/budgetConstants';
import { getPortfolioFinancials, getBudgetConsumptionRate, getBudgetStatus, getBudgetBarColor } from '@/utils/budgetUtils';
import { getTotalExpenses } from '@/utils/budgetUtils';
import { Wallet, ArrowRight } from 'lucide-react';

/**
 * Widget synthèse financière pour le Dashboard principal.
 * Design neutre et sobre.
 */
export function BudgetSummary() {
  const navigate = useNavigate();
  const { projects } = useProjectStore();

  const fin = getPortfolioFinancials(projects);

  const topProjects = [...projects]
    .filter((p) => (p.expenses || []).length > 0)
    .sort((a, b) => getTotalExpenses(b.expenses || []) - getTotalExpenses(a.expenses || []))
    .slice(0, 3);

  const alertCount = fin.projectsOverBudget + fin.projectsInWarning;

  return (
    <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-slate-100 text-slate-600 border border-slate-200 rounded-md">
            <Wallet size={18} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-base">Finances</h3>
            <p className="text-xs text-slate-500">Portefeuille global</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/finance')}
          className="text-xs font-bold text-blue-600 hover:underline cursor-pointer flex items-center gap-1"
        >
          Détail <ArrowRight size={13} />
        </button>
      </div>

      {/* KPIs globaux */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
          <p className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider">Budget alloué</p>
          <p className="text-sm font-extrabold text-slate-900">
            {fin.totalAllocated > 0 ? formatFCFACompact(fin.totalAllocated) : '—'}
          </p>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
          <p className="text-[11px] text-slate-500 mb-1 uppercase tracking-wider">Total dépensé</p>
          <p className="text-sm font-extrabold text-slate-900">
            {fin.totalSpent > 0 ? formatFCFACompact(fin.totalSpent) : '0 FCFA'}
          </p>
        </div>
      </div>

      {/* Barre globale */}
      {fin.totalAllocated > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-[11px] text-slate-500 mb-1">
            <span>Consommation globale</span>
            <span className="font-bold text-slate-700">{fin.consumptionRate.toFixed(1)}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-sm overflow-hidden">
            <div
              className={`h-full rounded-sm ${getBudgetBarColor(fin.consumptionRate >= 100 ? 'exceeded' : fin.consumptionRate >= 80 ? 'danger' : fin.consumptionRate >= 60 ? 'warning' : 'healthy')}`}
              style={{ width: `${Math.min(fin.consumptionRate, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Alerte sobre */}
      {alertCount > 0 && (
        <div className="mb-4 border border-slate-200 rounded-md px-3 py-2 text-xs text-slate-700 font-semibold bg-slate-50">
          {alertCount} projet{alertCount > 1 ? 's' : ''} en alerte budgétaire
        </div>
      )}

      {/* Top projets */}
      {topProjects.length > 0 && (
        <div className="space-y-1">
          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Top dépenses</p>
          {topProjects.map((p) => {
            const spent = getTotalExpenses(p.expenses || []);
            const rate = getBudgetConsumptionRate(p.budget?.allocated ?? 0, p.expenses || []);
            const status = getBudgetStatus(p.budget?.allocated, p.expenses || []);
            return (
              <div
                key={p.id}
                className="flex items-center justify-between cursor-pointer hover:bg-slate-50 rounded-md px-2 py-1.5 transition-colors"
                onClick={() => navigate(`/projects/${p.id}`)}
              >
                <div className="min-w-0 mr-3">
                  <p className="text-xs font-bold text-slate-800 truncate">{p.title}</p>
                  {p.budget?.allocated && (
                    <div className="w-20 h-1 bg-slate-100 rounded-sm mt-1 overflow-hidden">
                      <div
                        className={`h-full rounded-sm ${getBudgetBarColor(status)}`}
                        style={{ width: `${Math.min(rate, 100)}%` }}
                      />
                    </div>
                  )}
                </div>
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{formatFCFACompact(spent)}</span>
              </div>
            );
          })}
        </div>
      )}

      {fin.projectsWithBudget === 0 && fin.totalSpent === 0 && (
        <p className="text-center text-xs text-slate-400 py-2">Aucune donnée financière disponible</p>
      )}
    </div>
  );
}

export default BudgetSummary;
