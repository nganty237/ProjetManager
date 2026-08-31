import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { formatFCFACompact } from '@/utils/budgetConstants';
import {
  getPortfolioFinancials,
  getTotalExpenses,
  getBudgetConsumptionRate,
  getBudgetStatus,
  getBudgetBarColor,
} from '@/utils/budgetUtils';
import { BudgetOverview } from '@/components/Budget/BudgetOverview';
import { ExpenseList } from '@/components/Budget/ExpenseList';
import { ExpenseForm } from '@/components/Budget/ExpenseForm';
import { BudgetChart } from '@/components/Budget/BudgetChart';
import { Wallet, TrendingUp, CheckCircle, AlertTriangle, ChevronRight, Edit3, Save, X } from 'lucide-react';
import { Expense } from '@/types';

/**
 * Page dédiée à la gestion financière de tous les projets.
 * Accessible uniquement aux administrateurs.
 */
export function Finance() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, setBudget, addExpense, updateExpense } = useProjectStore();
  const isAdmin = user?.role === 'Administrateur';

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [editBudget, setEditBudget] = useState<string>('');
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const fin = getPortfolioFinancials(projects);
  const selectedProject = projects.find((p) => p.id === selectedProjectId);
  const expenses = selectedProject?.expenses || [];

  const handleSaveBudget = () => {
    const val = parseFloat(editBudget);
    if (!selectedProjectId || isNaN(val) || val < 0) return;
    setBudget(selectedProjectId, val);
    setIsEditingBudget(false);
  };

  const startEditBudget = () => {
    setEditBudget(String(selectedProject?.budget?.allocated ?? ''));
    setIsEditingBudget(true);
  };

  const handleAddExpense = (data: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => {
    if (!selectedProjectId) return;
    addExpense(selectedProjectId, data);
  };

  const handleEditExpense = (data: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => {
    if (!selectedProjectId || !editingExpense) return;
    updateExpense(selectedProjectId, editingExpense.id, data);
  };

  const sortedProjects = [...projects].sort(
    (a, b) => getTotalExpenses(b.expenses || []) - getTotalExpenses(a.expenses || [])
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestion Financière
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Suivi des budgets et des dépenses par projet — FCFA
        </p>
      </div>

      {/* KPIs Portefeuille — avec icônes colorées */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          {
            label: 'Budget Total Alloué',
            value: fin.totalAllocated > 0 ? formatFCFACompact(fin.totalAllocated) : '—',
            sub: `${fin.projectsWithBudget} projet${fin.projectsWithBudget > 1 ? 's' : ''} budgétisé${fin.projectsWithBudget > 1 ? 's' : ''}`,
            icon: Wallet,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50 border-blue-200',
          },
          {
            label: 'Total Dépensé',
            value: formatFCFACompact(fin.totalSpent),
            sub: fin.totalAllocated > 0 ? `${fin.consumptionRate.toFixed(1)}% du budget` : 'Hors budget',
            icon: TrendingUp,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Budget Restant',
            value: fin.totalAllocated > 0 ? formatFCFACompact(fin.totalRemaining) : '—',
            sub: fin.totalRemaining < 0 ? 'Dépassement !' : 'Disponible',
            icon: CheckCircle,
            iconColor: fin.totalRemaining < 0 ? 'text-rose-600' : 'text-indigo-600',
            iconBg: fin.totalRemaining < 0 ? 'bg-rose-50 border-rose-200' : 'bg-indigo-50 border-indigo-200',
          },
          {
            label: 'Projets en Alerte',
            value: String(fin.projectsOverBudget + fin.projectsInWarning),
            sub: `${fin.projectsOverBudget} dépassé${fin.projectsOverBudget > 1 ? 's' : ''}, ${fin.projectsInWarning} en danger`,
            icon: AlertTriangle,
            iconColor: (fin.projectsOverBudget + fin.projectsInWarning) > 0 ? 'text-amber-600' : 'text-slate-500',
            iconBg: (fin.projectsOverBudget + fin.projectsInWarning) > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200',
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-slate-200 rounded-md p-4 flex flex-col justify-between">
              <div className="flex items-start justify-between gap-2 mb-2">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{kpi.label}</p>
                <div className={`p-1.5 rounded border shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-xl font-extrabold text-slate-900 mb-0.5">{kpi.value}</p>
                <p className="text-[11px] text-slate-400">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contenu principal : liste projets + détail */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Colonne gauche : liste des projets */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="font-bold text-slate-900 text-sm">Projets</h3>
              <p className="text-xs text-slate-500 mt-0.5">Sélectionnez un projet pour voir son budget</p>
            </div>
            <div className="divide-y divide-slate-100 max-h-[520px] overflow-y-auto">
              {sortedProjects.map((project) => {
                const spent = getTotalExpenses(project.expenses || []);
                const status = getBudgetStatus(project.budget?.allocated, project.expenses || []);
                const rate = getBudgetConsumptionRate(project.budget?.allocated ?? 0, project.expenses || []);
                const barColor = getBudgetBarColor(status);
                const isSelected = selectedProjectId === project.id;

                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`w-full text-left px-4 py-3.5 transition-colors flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-slate-100 border-l-2 border-blue-600'
                        : 'hover:bg-slate-50 border-l-2 border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`text-xs font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-800'}`}>
                        {project.title}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {spent > 0 ? formatFCFACompact(spent) : 'Aucune dépense'}
                        {project.budget?.allocated ? ` / ${formatFCFACompact(project.budget.allocated)}` : ''}
                      </p>
                      {project.budget?.allocated && (
                        <div className="w-full h-1 bg-slate-100 rounded-sm mt-1.5 overflow-hidden">
                          <div className={`h-full rounded-sm ${barColor}`} style={{ width: `${Math.min(rate, 100)}%` }} />
                        </div>
                      )}
                    </div>
                    <ChevronRight size={14} className={isSelected ? 'text-blue-600' : 'text-slate-300'} />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Colonne droite : détail financier du projet sélectionné */}
        <div className="lg:col-span-2 space-y-5">
          {!selectedProject ? (
            <div className="bg-white border border-slate-200 rounded-md flex items-center justify-center h-64 text-slate-400 text-sm font-medium">
              Sélectionnez un projet pour voir ses détails financiers
            </div>
          ) : (
            <>
              {/* Titre + navigation projet */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">{selectedProject.title}</h2>
                  <button
                    onClick={() => navigate(`/projects/${selectedProject.id}`)}
                    className="text-xs text-blue-600 hover:underline mt-0.5 flex items-center gap-1"
                  >
                    Voir le projet <ChevronRight size={12} />
                  </button>
                </div>

                {/* Allocation du budget (admin) */}
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    {isEditingBudget ? (
                      <>
                        <div className="flex items-center border border-slate-300 rounded-md overflow-hidden">
                          <input
                            type="number"
                            value={editBudget}
                            onChange={(e) => setEditBudget(e.target.value)}
                            className="px-3 py-1.5 text-xs w-36 outline-none"
                            placeholder="Montant FCFA"
                            min="0"
                            autoFocus
                          />
                          <span className="px-2 text-[11px] text-slate-500 bg-slate-50 border-l border-slate-300">FCFA</span>
                        </div>
                        <button onClick={handleSaveBudget} className="btn btn-primary text-xs rounded-md flex items-center gap-1 px-3 py-1.5">
                          <Save size={13} /> Enregistrer
                        </button>
                        <button onClick={() => setIsEditingBudget(false)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500">
                          <X size={16} />
                        </button>
                      </>
                    ) : (
                      <button onClick={startEditBudget} className="btn btn-secondary text-xs rounded-md flex items-center gap-1.5 px-3 py-1.5">
                        <Edit3 size={13} />
                        {selectedProject.budget?.allocated ? 'Modifier le budget' : 'Définir un budget'}
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* BudgetOverview */}
              <BudgetOverview expenses={expenses} budget={selectedProject.budget} />

              {/* Répartition par catégorie */}
              <div className="bg-white border border-slate-200 rounded-md p-4">
                <h4 className="font-bold text-slate-900 text-sm mb-4">Répartition par catégorie</h4>
                <BudgetChart expenses={expenses} budget={selectedProject.budget} />
              </div>

              {/* Liste des dépenses */}
              <div className="bg-white border border-slate-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-sm">
                    Dépenses ({expenses.length})
                  </h4>
                  {isAdmin && (
                    <button
                      onClick={() => { setEditingExpense(undefined); setShowExpenseForm(true); }}
                      className="btn btn-primary text-xs flex items-center gap-1.5 rounded-md px-3 py-1.5"
                    >
                      + Ajouter une dépense
                    </button>
                  )}
                </div>
                <ExpenseList
                  projectId={selectedProject.id}
                  expenses={expenses}
                  isAdmin={isAdmin}
                  onAdd={() => { setEditingExpense(undefined); setShowExpenseForm(true); }}
                  onEdit={(exp) => { setEditingExpense(exp); setShowExpenseForm(true); }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modals */}
      {showExpenseForm && selectedProject && (
        <ExpenseForm
          projectId={selectedProject.id}
          expense={editingExpense}
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onClose={() => { setShowExpenseForm(false); setEditingExpense(undefined); }}
        />
      )}
    </div>
  );
}

export default Finance;
