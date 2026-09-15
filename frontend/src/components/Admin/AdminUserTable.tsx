import React from 'react';
import { 
  Send, 
  Trash2, 
  ToggleLeft, 
  ToggleRight, 
  Edit2 
} from 'lucide-react';
import { UserAvatar } from '@/components/Common/UserAvatar';
import { UserRole, UserStatus } from '@/types';
import { formatDate } from '@/utils/constants';

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  createdAt: string;
  invitationExpiresAt?: string;
}

interface AdminUserTableProps {
  users: ManagedUser[];
  currentUserId?: string;
  loading: boolean;
  onEditRole: (user: ManagedUser) => void;
  onResendInvite: (user: ManagedUser) => void;
  onToggleStatus: (user: ManagedUser) => void;
  onDeleteUser: (user: ManagedUser) => void;
}

/**
 * Rôle fonctionnel épuré sans fond artificiel.
 */
const RoleBadge: React.FC<{ role: UserRole }> = ({ role }) => {
  switch (role) {
    case 'ADMINISTRATEUR':
      return (
        <span className="text-xs font-bold text-slate-900 tracking-tight">
          Administrateur
        </span>
      );
    case 'CHEF_DE_PROJET':
      return (
        <span className="text-xs font-medium text-slate-700">
          Chef de projet
        </span>
      );
    case 'MEMBRE':
    default:
      return (
        <span className="text-xs font-normal text-slate-500">
          Membre
        </span>
      );
  }
};

/**
 * Statut du compte épuré avec puce colorée sobre (sans boîte de fond).
 */
const StatusBadge: React.FC<{ status: UserStatus }> = ({ status }) => {
  switch (status) {
    case 'ACTIF':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          Actif
        </span>
      );
    case 'EN_ATTENTE':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-600">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          En attente
        </span>
      );
    case 'INACTIF':
      return (
        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          Inactif
        </span>
      );
  }
};

/**
 * Tableau de gestion des utilisateurs de la plateforme par l'administrateur.
 */
export const AdminUserTable: React.FC<AdminUserTableProps> = ({
  users,
  currentUserId,
  loading,
  onEditRole,
  onResendInvite,
  onToggleStatus,
  onDeleteUser,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 text-xs">
        Chargement des utilisateurs...
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-12 text-center text-slate-400 text-xs">
        Aucun utilisateur ne correspond à vos critères de recherche.
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">Utilisateur</th>
              <th className="py-3 px-4">Rôle</th>
              <th className="py-3 px-4">Statut</th>
              <th className="py-3 px-4">Date de création</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              const isOtherAdmin = user.role === 'ADMINISTRATEUR' && !isSelf;

              return (
                <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                  
                  {/* Avatar, Nom et Email */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <UserAvatar name={user.name} avatar={user.avatar} size="sm" />
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                          {user.name}
                          {isSelf && (
                            <span className="text-[10px] font-normal text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100">
                              (Vous)
                            </span>
                          )}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Rôle et bouton d'édition */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <RoleBadge role={user.role} />
                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => onEditRole(user)}
                          className="text-slate-400 hover:text-blue-600 p-1 rounded transition-colors cursor-pointer"
                          title="Modifier le rôle"
                        >
                          <Edit2 size={12} />
                        </button>
                      )}
                    </div>
                  </td>

                  {/* Statut du compte */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <StatusBadge status={user.status} />
                  </td>

                  {/* Date de création */}
                  <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                    {formatDate(user.createdAt)}
                  </td>

                  {/* Actions disponibles */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      
                      {/* Renvoi d'invitation si en attente */}
                      {user.status === 'EN_ATTENTE' && (
                        <button
                          type="button"
                          onClick={() => onResendInvite(user)}
                          className="px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 text-[11px] font-bold border border-amber-200 transition-colors flex items-center gap-1 cursor-pointer"
                          title="Renvoyer le lien d'invitation"
                        >
                          <Send size={12} />
                          <span>Renvoyer invitation</span>
                        </button>
                      )}

                      {/* Activer / Désactiver le compte */}
                      {user.status !== 'EN_ATTENTE' && !isSelf && (
                        <button
                          type="button"
                          onClick={() => onToggleStatus(user)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            user.status === 'ACTIF'
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={user.status === 'ACTIF' ? 'Désactiver le compte' : 'Réactiver le compte'}
                        >
                          {user.status === 'ACTIF' ? (
                            <ToggleRight size={18} className="text-emerald-600" />
                          ) : (
                            <ToggleLeft size={18} className="text-slate-400" />
                          )}
                        </button>
                      )}

                      {/* Supprimer définitivement */}
                      <button
                        type="button"
                        onClick={() => onDeleteUser(user)}
                        disabled={isSelf || isOtherAdmin}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-20 disabled:hover:text-slate-400 disabled:hover:bg-transparent cursor-pointer"
                        title={
                          isSelf 
                            ? 'Impossible de supprimer votre propre compte' 
                            : isOtherAdmin 
                            ? 'Impossible de supprimer un autre administrateur' 
                            : 'Supprimer définitivement'
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
