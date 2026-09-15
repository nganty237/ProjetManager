import React from 'react';
import { FolderKanban, Search, X, ChevronRight } from 'lucide-react';
import { Project } from '@/types';
import { formatFCFACompact } from '@/utils/budgetConstants';
import {
  getTotalExpenses,
  getBudgetConsumptionRate,
} from '@/utils/budgetUtils';
import { statusConfig } from '@/utils/constants';

interface FinanceProjectListProps {
  projects: Project[];
  selectedProjectId: string | null;
  onSelectProject: (id: string) => void;
  search: string;
  onSearchChange: (value: string) => void;
  filter: 'all' | 'budgeted' | 'alerts';
  onFilterChange: (filter: 'all' | 'budgeted' | 'alerts') => void;
}

/**
 * Composant de sélection et de filtrage des projets pour la gestion financière.
 */
export const FinanceProjectList: React.FC<FinanceProjectListProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  search,
  onSearchChange,
  filter,
  onFilterChange,
}) => {
  // Filtrage des projets
  const filteredProjects = projects
    .filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
      if (!matchSearch) return false;

      if (filter === 'budgeted') {
        return (p.budget?.allocated ?? 0) > 0;
      }
      if (filter === 'alerts') {
        const rate = getBudgetConsumptionRate(p.budget?.allocated ?? 0, p.expenses || []);
        return (p.budget?.allocated ?? 0) > 0 && rate >= 80;
      }
      return true;
    })
    .sort((a, b) => getTotalExpenses(b.expenses || []) - getTotalExpenses(a.expenses || []));

  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs">
      {/* En-tête de la liste */}
      <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderKanban size={16} className="text-slate-500" />
            <h3 className="font-bold text-slate-900 text-sm">Projets ({projects.length})</h3>
          </div>
        </div>

        {/* Barre de recherche */}
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Filtrer par nom..."
            className="w-full bg-slate-50 focus:bg-white focus:border-blue-600 border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none rounded-md transition-colors"
          />
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X size={12} />
            </button>
          )}
        </div>

        {/* Onglets filtres rapides */}
        <div className="flex gap-1.5 pt-1">
          {[
            { id: 'all' as const, label: 'Tous' },
            { id: 'budgeted' as const, label: 'Budgétisés' },
            { id: 'alerts' as const, label: 'Alertes' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => onFilterChange(tab.id)}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors cursor-pointer ${
                filter === tab.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste déroulante des projets */}
      <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
        {filteredProjects.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Aucun projet trouvé avec ce filtre.
          </div>
        ) : (
          filteredProjects.map((project) => {
            const spent = getTotalExpenses(project.expenses || []);
            const allocated = project.budget?.allocated ?? 0;
            const hasBudget = allocated > 0;
            const isSelected = selectedProjectId === project.id;
            const pStatus = statusConfig[project.status];

            return (
              <button
                key={project.id}
                type="button"
                onClick={() => onSelectProject(project.id)}
                className={`w-full text-left p-3.5 sm:p-4 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                  isSelected
                    ? 'bg-blue-50/60 border-l-4 border-blue-600'
                    : 'hover:bg-slate-50 border-l-4 border-transparent'
                }`}
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold ${pStatus?.color || 'text-slate-500'}`}>
                      {pStatus?.label || project.status}
                    </span>
                  </div>

                  <p className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                    {project.title}
                  </p>

                  {(spent > 0 || hasBudget) && (
                    <div className="flex items-center justify-between text-xs pt-0.5">
                      {spent > 0 ? (
                        <>
                          <span className="text-slate-600 font-semibold">
                            {formatFCFACompact(spent)}
                            <span className="text-slate-400 font-normal"> dépensé</span>
                          </span>
                          {hasBudget && (
                            <span className="text-[11px] font-bold text-slate-500">
                              / {formatFCFACompact(allocated)}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-[11px] text-slate-500 font-medium">
                          Budget : <span className="font-bold text-slate-700">{formatFCFACompact(allocated)}</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <ChevronRight
                  size={16}
                  className={`shrink-0 transition-transform ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'}`}
                />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
