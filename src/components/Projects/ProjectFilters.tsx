import React from 'react';
import { ProjectStatus, ProjectPriority, ViewMode } from '@/types';
import { Filter, X, Grid3x3, List, Trello } from 'lucide-react';
import { useProjectStore } from '@/store/projectStore';
import { statusConfig, priorityConfig } from '@/utils/constants';

interface ProjectFiltersProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({ viewMode, onViewModeChange }) => {
  const { filters, setFilters, clearFilters } = useProjectStore();
  const [showFilters, setShowFilters] = React.useState(false);
  
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
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };
  
  const hasActiveFilters = 
    (filters.status && filters.status.length > 0) ||
    (filters.priority && filters.priority.length > 0) ||
    (filters.search && filters.search.length > 0);
  
  return (
    <div className="space-y-4">
      {/* Barre principale */}
      <div className="flex items-center gap-4">
        {/* Recherche */}
        <div className="flex-1">
          <input
            type="text"
            placeholder="Rechercher un projet..."
            value={filters.search || ''}
            onChange={handleSearchChange}
            className="input"
          />
        </div>
        
        {/* Bouton Filtres */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`btn ${hasActiveFilters ? 'btn-primary' : 'btn-secondary'} flex items-center gap-2`}
        >
          <Filter size={20} />
          Filtres
          {hasActiveFilters && (
            <span className="ml-1 px-2 py-0.5 bg-white text-primary-600 rounded-full text-xs font-bold">
              •
            </span>
          )}
        </button>
        
        {/* Clear filters */}
        {hasActiveFilters && (
          <button onClick={clearFilters} className="btn btn-secondary flex items-center gap-2">
            <X size={20} />
            Effacer
          </button>
        )}
        
        {/* View modes */}
        <div className="flex items-center gap-2 border border-gray-300 rounded-lg p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded ${
              viewMode === 'grid'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Vue grille"
          >
            <Grid3x3 size={20} />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded ${
              viewMode === 'list'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Vue liste"
          >
            <List size={20} />
          </button>
          <button
            onClick={() => onViewModeChange('kanban')}
            className={`p-2 rounded ${
              viewMode === 'kanban'
                ? 'bg-primary-100 text-primary-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title="Vue Kanban"
          >
            <Trello size={20} />
          </button>
        </div>
      </div>
      
      {/* Panneau de filtres détaillés */}
      {showFilters && (
        <div className="card">
          <div className="grid grid-cols-2 gap-6">
            {/* Filtres par statut */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Statut</h3>
              <div className="space-y-2">
                {statuses.map((status) => (
                  <label
                    key={status}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.status?.includes(status) || false}
                      onChange={() => handleStatusToggle(status)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className={statusConfig[status].color}>
                        {statusConfig[status].icon}
                      </span>
                      <span className="text-sm text-gray-700">{statusConfig[status].label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Filtres par priorité */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Priorité</h3>
              <div className="space-y-2">
                {priorities.map((priority) => (
                  <label
                    key={priority}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={filters.priority?.includes(priority) || false}
                      onChange={() => handlePriorityToggle(priority)}
                      className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                    />
                    <div className="flex items-center gap-2">
                      <span className={priorityConfig[priority].color}>
                        {priorityConfig[priority].icon}
                      </span>
                      <span className="text-sm text-gray-700">{priorityConfig[priority].label}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectFilters;
