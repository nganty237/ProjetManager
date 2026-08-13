import { useState } from 'react';
import { ProjectStatus, ProjectPriority, ViewMode } from '@/types';
import { Filter, X, Grid3x3, List, Trello } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { statusConfig, priorityConfig } from '@/utils/constants';

interface ProjectFiltersProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function ProjectFilters({ viewMode, onViewModeChange }: ProjectFiltersProps) {
  const { filters, setFilters, clearFilters } = useProjectStore();
  const [showFilters, setShowFilters] = useState(false);

  const statuses = Object.keys(statusConfig) as ProjectStatus[];
  const priorities = Object.keys(priorityConfig) as ProjectPriority[];

  const handleStatusToggle = (status: ProjectStatus) => {
    const current = filters.status || [];
    const updated = current.includes(status)
      ? current.filter((s) => s !== status)
      : [...current, status];
    setFilters({ ...filters, status: updated });
  };

  const handlePriorityToggle = (priority: ProjectPriority) => {
    const current = filters.priority || [];
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    setFilters({ ...filters, priority: updated });
  };

  const handleQuickStatusSelect = (statusKey: string | null) => {
    if (!statusKey) {
      setFilters({ ...filters, status: [] });
    } else {
      setFilters({ ...filters, status: [statusKey as ProjectStatus] });
    }
  };

  const hasActiveFilters =
    (filters.status && filters.status.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    (filters.search && filters.search.length > 0);

  const activeStatus = filters.status && filters.status.length === 1 ? filters.status[0] : null;

  return (
    <div className="space-y-3">
      {/* Barre de filtres principale épurée */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2 sm:p-2.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Puces de filtrage rapide de statut */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          <button
            onClick={() => handleQuickStatusSelect(null)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              !filters.status || filters.status.length === 0
                ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            Tous les projets
          </button>
          {statuses.map((st) => {
            const isSel = activeStatus === st;
            return (
              <button
                key={st}
                onClick={() => handleQuickStatusSelect(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSel
                    ? 'bg-blue-600 text-white shadow-xs shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {statusConfig[st].label}
              </button>
            );
          })}
        </div>

        {/* Contrôles de droite : Filtres avancés + Vue Switcher */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Bouton de filtres avancés */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
              hasActiveFilters
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80'
            }`}
          >
            <Filter size={14} />
            Filtres avancés
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-blue-600" />
            )}
          </button>

          {/* Effacer filtres */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200/70 transition-all flex items-center gap-1 cursor-pointer"
            >
              <X size={14} />
              Effacer
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 mx-1 hidden xs:block" />

          {/* Sélecteur de vues moderne */}
          <div className="flex items-center bg-slate-100/80 p-1 rounded-xl gap-0.5 border border-slate-200/60">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Grille"
            >
              <Grid3x3 size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Liste"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'kanban'
                  ? 'bg-white text-blue-600 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Kanban"
            >
              <Trello size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Tiroir de filtres avancés */}
      {showFilters && (
        <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-lg animate-in fade-in duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            {/* Filtres par statut */}
            <div>
              <h4 className="font-extrabold text-slate-900 mb-2.5 uppercase tracking-wider text-[11px]">
                Filtrer par Statut
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {statuses.map((st) => {
                  const checked = filters.status?.includes(st) || false;
                  return (
                    <label
                      key={st}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? 'bg-blue-50/70 border-blue-200 text-blue-900 font-bold'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleStatusToggle(st)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span className="truncate">{statusConfig[st].label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Filtres par priorité */}
            <div>
              <h4 className="font-extrabold text-slate-900 mb-2.5 uppercase tracking-wider text-[11px]">
                Filtrer par Priorité
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {priorities.map((pr) => {
                  const checked = filters.priority?.includes(pr) || false;
                  return (
                    <label
                      key={pr}
                      className={`flex items-center gap-2 p-2 rounded-xl border cursor-pointer transition-all ${
                        checked
                          ? 'bg-blue-50/70 border-blue-200 text-blue-900 font-bold'
                          : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handlePriorityToggle(pr)}
                        className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                      />
                      <span className="truncate">{priorityConfig[pr].label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectFilters;
