import React, { useState } from 'react';
import { UserPlus, X } from 'lucide-react';
import { UserRole } from '@/types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userData: { name: string; email: string; role: UserRole }) => Promise<void>;
}

/**
 * Modale permettant à l'administrateur de créer un compte utilisateur invité.
 */
export const CreateUserModal: React.FC<CreateUserModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<{ name: string; email: string; role: UserRole }>({
    name: '',
    email: '',
    role: 'MEMBRE',
  });
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
      setFormData({ name: '', email: '', role: 'MEMBRE' });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 max-w-md w-full p-6 shadow-xl space-y-5">
        {/* En-tête modale */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <UserPlus size={18} className="text-blue-600" />
            <span>Nouveau compte utilisateur</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Formulaire de création */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Nom complet</label>
            <input
              type="text"
              required
              placeholder="Ex: Paul Martin"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="input text-xs"
            />
          </div>

          <div>
            <label className="label">Adresse Email</label>
            <input
              type="email"
              required
              placeholder="paul.martin@entreprise.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="input text-xs"
            />
          </div>

          <div>
            <label className="label">Rôle attribué</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
              className="input text-xs bg-white cursor-pointer"
            >
              <option value="MEMBRE">Membre (Accès aux projets et tâches assignés)</option>
              <option value="CHEF_DE_PROJET">Chef de projet (Pilotage de ses projets, tâches, budget)</option>
              <option value="ADMINISTRATEUR">Administrateur (Gestion complète de la plateforme)</option>
            </select>
            <p className="text-[11px] text-slate-400 mt-1">
              Le compte sera créé en attente d'activation. L'utilisateur recevra un lien pour définir son mot de passe.
            </p>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded text-xs font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary px-4 py-2 text-xs font-bold flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {submitting ? 'Création en cours...' : 'Créer et générer invitation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
