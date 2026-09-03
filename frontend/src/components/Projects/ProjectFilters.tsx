import { useState } from 'react';
import { ProjectStatus, ProjectPriority, ViewMode } from '@/types';
import { Filter, X, Grid3x3, List, Trello } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { statusConfig, priorityConfig } from '@/utils/constants';

interface ProjectFiltersProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

/**
 * Filter toolbar component with subtle rounded styling for buttons and dropdowns.
 */
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
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-2.5 border border-slate-200 rounded-md">
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
          <button
            onClick={() => handleQuickStatusSelect(null)}
            className={`px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer border rounded-md ${
              !filters.status || filters.status.length === 0
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
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
                className={`px-3 py-1.5 text-xs font-bold transition-colors whitespace-nowrap cursor-pointer border rounded-md ${
                  isSel
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {statusConfig[st].label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer rounded-md ${
              hasActiveFilters
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            <Filter size={14} />
            Filtres avancés
            {hasActiveFilters && (
              <span className="w-2 h-2 bg-blue-600 rounded-full" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 transition-colors flex items-center gap-1 cursor-pointer rounded-md"
            >
              <X size={14} />
              Effacer
            </button>
          )}

          <div className="h-4 w-px bg-slate-200 mx-1 hidden xs:block" />

          <div className="flex items-center bg-slate-100 p-0.5 border border-slate-200 gap-0.5 rounded-md">
            <button
              onClick={() => onViewModeChange('grid')}
              className={`p-1.5 text-xs font-bold transition-colors cursor-pointer rounded ${
                viewMode === 'grid'
                  ? 'bg-white text-blue-600 border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Grille"
            >
              <Grid3x3 size={15} />
            </button>
            <button
              onClick={() => onViewModeChange('list')}
              className={`p-1.5 text-xs font-bold transition-colors cursor-pointer rounded ${
                viewMode === 'list'
                  ? 'bg-white text-blue-600 border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Liste"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => onViewModeChange('kanban')}
              className={`p-1.5 text-xs font-bold transition-colors cursor-pointer rounded ${
                viewMode === 'kanban'
                  ? 'bg-white text-blue-600 border border-slate-200'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Vue Kanban"
            >
              <Trello size={15} />
            </button>
          </div>
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
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
                      className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-colors ${
                        checked
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleStatusToggle(st)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 rounded-sm"
                      />
                      <span className="truncate">{statusConfig[st].label}</span>
                    </label>
                  );
                })}
              </div>
            </div>

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
                      className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-colors ${
                        checked
                          ? 'bg-blue-50 border-blue-300 text-blue-900 font-bold'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handlePriorityToggle(pr)}
                        className="text-blue-600 focus:ring-blue-500 h-3.5 w-3.5 rounded-sm"
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
