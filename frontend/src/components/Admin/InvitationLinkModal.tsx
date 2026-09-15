import React, { useState } from 'react';
import { Mail, Copy, Check, X } from 'lucide-react';

interface InvitationLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: {
    name: string;
    email: string;
    link: string;
  } | null;
}

/**
 * Modale affichant le lien d'invitation sécurisé avec option de copie dans le presse-papiers.
 */
export const InvitationLinkModal: React.FC<InvitationLinkModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !data) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(data.link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg border border-slate-200 max-w-lg w-full p-6 shadow-xl space-y-5">
        {/* En-tête */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
            <Mail size={18} className="text-blue-600" />
            <span>Lien d'invitation généré</span>
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Corps d'informations */}
        <div className="space-y-3">
          <div className="bg-blue-50 text-blue-900 p-3 rounded-lg text-xs leading-relaxed border border-blue-200">
            <p className="font-bold">
              Invitation pour {data.name} ({data.email})
            </p>
            <p className="text-[11px] text-blue-700 mt-0.5">
              En mode simulation, vous pouvez copier le lien ci-dessous et le transmettre directement à l'utilisateur.
              Il lui permettra de définir son mot de passe et d'activer son compte.
            </p>
          </div>

          <div>
            <label className="label">Lien d'activation sécurisé</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={data.link}
                className="input text-xs font-mono bg-slate-50 select-all"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="btn btn-primary shrink-0 flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold cursor-pointer"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span>{copied ? 'Copié !' : 'Copier'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="flex justify-end pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-primary px-4 py-2 text-xs font-bold cursor-pointer"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
