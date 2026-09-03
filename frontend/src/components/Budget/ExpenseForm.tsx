import React, { useState } from 'react';
import { Expense, ExpenseCategory } from '@/types';
import { expenseCategoryConfig } from '@/utils/budgetConstants';
import { X } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface ExpenseFormProps {
  projectId: string;
  expense?: Expense; // Si défini → mode édition
  onSubmit: (data: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => void;
  onClose: () => void;
}

const CATEGORIES = Object.keys(expenseCategoryConfig) as ExpenseCategory[];

/**
 * Modal d'ajout ou d'édition d'une dépense.
 */
export function ExpenseForm({ projectId: _projectId, expense, onSubmit, onClose }: ExpenseFormProps) {
  const { user } = useAuthStore();

  const [form, setForm] = useState({
    label: expense?.label ?? '',
    amount: expense?.amount ? String(expense.amount) : '',
    category: expense?.category ?? ('other' as ExpenseCategory),
    date: expense?.date
      ? new Date(expense.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
    description: expense?.description ?? '',
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(form.amount);
    if (!form.label.trim()) { setError('Le libellé est requis.'); return; }
    if (isNaN(amount) || amount <= 0) { setError('Le montant doit être un nombre positif.'); return; }

    onSubmit({
      label: form.label.trim(),
      amount,
      category: form.category,
      date: new Date(form.date),
      description: form.description.trim() || undefined,
      createdBy: user?.name ?? 'Inconnu',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-md max-w-md w-full border border-slate-200 shadow-lg">
        {/* Header */}
        <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">
            {expense ? 'Modifier la dépense' : 'Nouvelle dépense'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded transition-colors text-slate-500"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Libellé */}
          <div>
            <label className="label">Libellé *</label>
            <input
              type="text"
              name="label"
              value={form.label}
              onChange={handleChange}
              className="input"
              placeholder="Ex : Licence Adobe, Prestataire UX..."
              required
            />
          </div>

          {/* Montant + Catégorie */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Montant (FCFA) *</label>
              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="input"
                placeholder="Ex : 150000"
                min="1"
                step="1"
                required
              />
            </div>
            <div>
              <label className="label">Catégorie *</label>
              <select name="category" value={form.category} onChange={handleChange} className="input">
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {expenseCategoryConfig[cat].label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="label">Date *</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="label">Justificatif / Note <span className="text-slate-400 font-normal">(optionnel)</span></label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="input resize-none"
              placeholder="Numéro de facture, prestataire, détails..."
            />
          </div>

          {/* Erreur */}
          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2 border-t border-slate-200">
            <button type="button" onClick={onClose} className="btn btn-secondary flex-1 rounded-md">
              Annuler
            </button>
            <button type="submit" className="btn btn-primary flex-1 rounded-md">
              {expense ? 'Mettre à jour' : 'Enregistrer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ExpenseForm;
