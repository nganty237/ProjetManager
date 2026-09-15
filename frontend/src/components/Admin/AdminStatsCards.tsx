import React from 'react';

interface AdminStatsCardsProps {
  totalUsers: number;
  activeUsers: number;
  pendingUsers: number;
  inactiveUsers: number;
}

/**
 * Composant affichant les indicateurs clés (KPIs) des comptes utilisateurs pour l'administrateur.
 */
export const AdminStatsCards: React.FC<AdminStatsCardsProps> = ({
  totalUsers,
  activeUsers,
  pendingUsers,
  inactiveUsers,
}) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Total des comptes */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
        <p className="text-xs font-medium text-slate-500">Total Comptes</p>
        <p className="text-2xl font-extrabold text-slate-900 mt-1">{totalUsers}</p>
      </div>

      {/* Comptes Actifs */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
        <p className="text-xs font-medium text-slate-500">Comptes Actifs</p>
        <p className="text-2xl font-extrabold text-emerald-600 mt-1">{activeUsers}</p>
      </div>

      {/* Comptes en attente d'activation */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
        <p className="text-xs font-medium text-slate-500">En attente d'activation</p>
        <p className="text-2xl font-extrabold text-amber-600 mt-1">{pendingUsers}</p>
      </div>

      {/* Comptes Inactifs */}
      <div className="bg-white border border-slate-200 p-4 rounded-lg shadow-xs">
        <p className="text-xs font-medium text-slate-500">Comptes Inactifs</p>
        <p className="text-2xl font-extrabold text-rose-600 mt-1">{inactiveUsers}</p>
      </div>
    </div>
  );
};
