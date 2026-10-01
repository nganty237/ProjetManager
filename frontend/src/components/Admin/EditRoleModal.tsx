import React from 'react';
import { Check } from 'lucide-react';
import { UserRole } from '@/types';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface EditRoleModalProps {
  user: ManagedUser | null;
  onClose: () => void;
  onUpdateRole: (userId: string, newRole: UserRole) => Promise<void>;
}

/**
 * Modale permettant à l'administrateur de modifier le rôle d'un compte utilisateur.
 */
export const EditRoleModal: React.FC<EditRoleModalProps> = ({
  user,
  onClose,
  onUpdateRole,
}) => {
  if (!user) return null;

  const roles: { role: UserRole; label: string }[] = [
    { role: 'MEMBRE', label: 'Membre' },
    { role: 'CHEF_DE_PROJET', label: 'Chef de projet' },
    { role: 'ADMINISTRATEUR', label: 'Administrateur' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 max-w-sm w-full p-5 shadow-xl space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900">
          Changer le rôle de {user.name}
        </h3>
        <p className="text-xs text-slate-500">
          Sélectionnez le nouveau rôle pour ce compte utilisateur :
        </p>
        <div className="space-y-2">
          {roles.map(({ role, label }) => (
            <button
              key={role}
              type="button"
              onClick={() => onUpdateRole(user.id, role)}
              className={`w-full text-left p-3 rounded-md text-xs font-bold border transition-colors cursor-pointer flex items-center justify-between ${
                user.role === role 
                  ? 'border-blue-600 bg-blue-50 text-blue-900' 
                  : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <span>{label}</span>
              {user.role === role && <Check size={14} className="text-blue-600" />}
            </button>
          ))}
        </div>
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded cursor-pointer font-medium transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    </div>
  );
};
