import { useState } from 'react';
import { Expense } from '@/types';
import { expenseCategoryConfig, formatFCFA } from '@/utils/budgetConstants';
import { useProjectStore } from '@/store/projectStore';
import { Trash2, Edit3, Plus, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '@/utils/constants';

interface ExpenseListProps {
  projectId: string;
  expenses: Expense[];
  isAdmin: boolean;
  onAdd: () => void;
  onEdit: (expense: Expense) => void;
}

/**
 * Tableau paginé et triable des dépenses d'un projet.
 */
export function ExpenseList({ projectId, expenses, isAdmin, onAdd, onEdit }: ExpenseListProps) {
  const { deleteExpense } = useProjectStore();
  const [sortField, setSortField] = useState<'date' | 'amount' | 'category'>('date');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const sorted = [...expenses].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'date') cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
    else if (sortField === 'amount') cmp = a.amount - b.amount;
    else if (sortField === 'category') cmp = a.category.localeCompare(b.category);
    return sortDir === 'asc' ? cmp : -cmp;
  });

  const SortIcon = ({ field }: { field: typeof sortField }) => {
    if (sortField !== field) return <ChevronDown size={12} className="text-slate-300" />;
    return sortDir === 'asc'
      ? <ChevronUp size={12} className="text-blue-600" />
      : <ChevronDown size={12} className="text-blue-600" />;
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-400 border border-dashed border-slate-200 rounded-md">
        <p className="text-sm font-medium mb-3">Aucune dépense enregistrée</p>
        {isAdmin && (
          <button
            onClick={onAdd}
            className="btn btn-primary text-xs flex items-center gap-1.5 rounded-md"
          >
            <Plus size={14} /> Ajouter la première dépense
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="w-full text-left border-collapse text-xs">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            <th
              className="py-3 px-4 cursor-pointer hover:text-slate-700 select-none"
              onClick={() => handleSort('date')}
            >
              <span className="flex items-center gap-1">Date <SortIcon field="date" /></span>
            </th>
            <th className="py-3 px-4">Libellé</th>
            <th
              className="py-3 px-4 cursor-pointer hover:text-slate-700 select-none"
              onClick={() => handleSort('category')}
            >
              <span className="flex items-center gap-1">Catégorie <SortIcon field="category" /></span>
            </th>
            <th
              className="py-3 px-4 text-right cursor-pointer hover:text-slate-700 select-none"
              onClick={() => handleSort('amount')}
            >
              <span className="flex items-center gap-1 justify-end">Montant <SortIcon field="amount" /></span>
            </th>
            <th className="py-3 px-4">Par</th>
            {isAdmin && <th className="py-3 px-4 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sorted.map((expense) => {
            const cat = expenseCategoryConfig[expense.category];
            return (
              <tr key={expense.id} className="hover:bg-slate-50 transition-colors group">
                <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                  {formatDate(expense.date)}
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-slate-900">{expense.label}</p>
                  {expense.description && (
                    <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                      {expense.description}
                    </p>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`badge ${cat.bgColor} ${cat.color} ${cat.borderColor} border flex items-center gap-1 w-fit rounded`}>
                    {cat.icon} {cat.label}
                  </span>
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-900 whitespace-nowrap">
                  {formatFCFA(expense.amount)}
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px]">{expense.createdBy}</td>
                {isAdmin && (
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center gap-1.5 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(expense)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Modifier"
                      >
                        <Edit3 size={14} />
                      </button>
                      {confirmDelete === expense.id ? (
                        <span className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              deleteExpense(projectId, expense.id);
                              setConfirmDelete(null);
                            }}
                            className="px-2 py-1 bg-red-600 text-white rounded text-[11px] font-bold hover:bg-red-700"
                          >
                            Confirmer
                          </button>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="px-2 py-1 text-slate-500 rounded text-[11px] hover:bg-slate-100"
                          >
                            Annuler
                          </button>
                        </span>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(expense.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          <tr className="bg-slate-50 border-t-2 border-slate-200 font-bold">
            <td colSpan={3} className="py-3 px-4 text-xs text-slate-600 uppercase tracking-wider">
              Total
            </td>
            <td className="py-3 px-4 text-right text-sm text-slate-900">
              {formatFCFA(expenses.reduce((s, e) => s + e.amount, 0))}
            </td>
            <td colSpan={isAdmin ? 2 : 1} />
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

export default ExpenseList;
