import React from 'react';
import { Wallet, TrendingUp, CheckCircle, AlertTriangle } from 'lucide-react';
import { formatFCFACompact } from '@/utils/budgetConstants';

interface PortfolioFinancialKpisProps {
  totalAllocated: number;
  totalSpent: number;
  totalRemaining: number;
  consumptionRate: number;
  projectsCount: number;
  projectsWithBudget: number;
  projectsOverBudget: number;
  projectsInWarning: number;
}

/**
 * Cartes KPI de synthèse financière à l'échelle du portefeuille de projets.
 */
export const PortfolioFinancialKpis: React.FC<PortfolioFinancialKpisProps> = ({
  totalAllocated,
  totalSpent,
  totalRemaining,
  consumptionRate,
  projectsCount,
  projectsWithBudget,
  projectsOverBudget,
  projectsInWarning,
}) => {
  const kpiItems = [
    {
      label: 'Budget Total Alloué',
      value: totalAllocated > 0 ? formatFCFACompact(totalAllocated) : '0 FCFA',
      sub: `${projectsWithBudget} sur ${projectsCount} projet${projectsCount > 1 ? 's' : ''} budgétisé${projectsWithBudget > 1 ? 's' : ''}`,
      icon: Wallet,
      iconStyle: 'bg-[#2563EB] text-white',
    },
    {
      label: 'Total Dépensé',
      value: formatFCFACompact(totalSpent),
      sub: totalAllocated > 0 ? `${consumptionRate.toFixed(1)}% du budget total` : 'Dépenses enregistrées',
      icon: TrendingUp,
      iconStyle: 'bg-[#16A34A] text-white',
    },
    {
      label: 'Budget Restant',
      value: totalAllocated > 0 ? formatFCFACompact(totalRemaining) : '—',
      sub: totalRemaining < 0 ? 'Dépassement global' : 'Solde disponible',
      icon: CheckCircle,
      iconStyle: totalRemaining < 0 ? 'bg-[#DC2626] text-white' : 'bg-[#6366F1] text-white',
    },
    {
      label: 'Projets en Alerte',
      value: String(projectsOverBudget + projectsInWarning),
      sub: `${projectsOverBudget} dépassé${projectsOverBudget > 1 ? 's' : ''}, ${projectsInWarning} sous tension`,
      icon: AlertTriangle,
      iconStyle: (projectsOverBudget + projectsInWarning) > 0 ? 'bg-[#D97706] text-white' : 'bg-slate-700 text-white',
    },
  ];

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiItems.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <div
            key={kpi.label}
            className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 flex flex-col justify-between shadow-xs"
          >
            <div className="flex items-start justify-between gap-2 mb-3">
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                {kpi.label}
              </p>
              <div className={`p-2 rounded-md shrink-0 ${kpi.iconStyle}`}>
                <Icon size={18} />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">
                {kpi.value}
              </p>
              <p className="text-xs text-slate-500">{kpi.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};
