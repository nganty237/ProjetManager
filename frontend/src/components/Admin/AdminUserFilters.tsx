import React from 'react';
import { Search } from 'lucide-react';
import { UserRole, UserStatus } from '@/types';

interface AdminUserFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: 'all' | UserStatus;
  onStatusFilterChange: (status: 'all' | UserStatus) => void;
  roleFilter: 'all' | UserRole;
  onRoleFilterChange: (role: 'all' | UserRole) => void;
  totalCount: number;
  activeCount: number;
  pendingCount: number;
  inactiveCount: number;
}

/**
 * Composant de filtrage et de recherche pour la gestion administrative des utilisateurs.
 */
export const AdminUserFilters: React.FC<AdminUserFiltersProps> = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  roleFilter,
  onRoleFilterChange,
  totalCount,
  activeCount,
  pendingCount,
  inactiveCount,
}) => {
  return (
    <div className="bg-white border border-slate-200 p-4 rounded-lg space-y-3 shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Champ de recherche */}
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher par nom ou email..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="input pl-9 text-xs w-full"
          />
        </div>

        {/* Onglets de filtrage par statut */}
        <div className="flex items-center bg-slate-100 p-1 rounded-md text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => onStatusFilterChange('all')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'all' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tous ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('ACTIF')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'ACTIF' ? 'bg-white text-emerald-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Actifs ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('EN_ATTENTE')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'EN_ATTENTE' ? 'bg-white text-amber-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            En attente ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => onStatusFilterChange('INACTIF')}
            className={`px-3 py-1.5 rounded transition-all cursor-pointer whitespace-nowrap ${
              statusFilter === 'INACTIF' ? 'bg-white text-rose-700 shadow-sm font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inactifs ({inactiveCount})
          </button>
        </div>

        {/* Sélecteur de filtrage par rôle */}
        <select
          value={roleFilter}
          onChange={(e) => onRoleFilterChange(e.target.value as 'all' | UserRole)}
          className="input text-xs w-auto bg-white cursor-pointer"
        >
          <option value="all">Tous les rôles</option>
          <option value="ADMINISTRATEUR">Administrateurs</option>
          <option value="CHEF_DE_PROJET">Chefs de projet</option>
          <option value="MEMBRE">Membres</option>
        </select>

      </div>
    </div>
  );
};
