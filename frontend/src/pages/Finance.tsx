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
import { 
  Wallet, 
  TrendingUp, 
  CheckCircle, 
  AlertTriangle, 
  ChevronRight, 
  Edit3, 
  Save, 
  X, 
  Search, 
  ExternalLink,
  FolderKanban,
  Plus
} from 'lucide-react';
import { Expense } from '@/types';
import { statusConfig } from '@/utils/constants';

/**
 * Page dédiée à la gestion financière de tous les projets.
 * Design professionnel, sobre et optimisé pour le suivi budgétaire.
 */
export function Finance() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, setBudget, addExpense, updateExpense } = useProjectStore();
  const isAdmin = user?.role === 'Administrateur';

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => projects[0]?.id ?? null);
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState<'all' | 'budgeted' | 'alerts'>('all');
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [editBudget, setEditBudget] = useState<string>('');
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  const fin = getPortfolioFinancials(projects);
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : null);
  const selectedProject = projects.find((p) => p.id === activeProjectId);
  const expenses = selectedProject?.expenses || [];

  const handleSaveBudget = () => {
    const val = parseFloat(editBudget);
    if (!activeProjectId || isNaN(val) || val < 0) return;
    setBudget(activeProjectId, val);
    setIsEditingBudget(false);
  };

  const startEditBudget = () => {
    setEditBudget(String(selectedProject?.budget?.allocated ?? ''));
    setIsEditingBudget(true);
  };

  const handleAddExpense = (data: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => {
    if (!activeProjectId) return;
    addExpense(activeProjectId, data);
  };

  const handleEditExpense = (data: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => {
    if (!activeProjectId || !editingExpense) return;
    updateExpense(activeProjectId, editingExpense.id, data);
  };

  // Filtrage et tri des projets
  const filteredProjects = projects
    .filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(projectSearch.toLowerCase());
      if (!matchSearch) return false;

      if (projectFilter === 'budgeted') {
        return (p.budget?.allocated ?? 0) > 0;
      }
      if (projectFilter === 'alerts') {
        const rate = getBudgetConsumptionRate(p.budget?.allocated ?? 0, p.expenses || []);
        return (p.budget?.allocated ?? 0) > 0 && rate >= 80;
      }
      return true;
    })
    .sort((a, b) => getTotalExpenses(b.expenses || []) - getTotalExpenses(a.expenses || []));

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestion Financière
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Suivi des budgets, contrôle des coûts et des dépenses par projet — FCFA
        </p>
      </div>

      {/* KPIs Portefeuille */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'Budget Total Alloué',
            value: fin.totalAllocated > 0 ? formatFCFACompact(fin.totalAllocated) : '0 FCFA',
            sub: `${fin.projectsWithBudget} sur ${projects.length} projet${projects.length > 1 ? 's' : ''} budgétisé${fin.projectsWithBudget > 1 ? 's' : ''}`,
            icon: Wallet,
            iconColor: 'text-blue-600',
            iconBg: 'bg-blue-50 border-blue-200',
          },
          {
            label: 'Total Dépensé',
            value: formatFCFACompact(fin.totalSpent),
            sub: fin.totalAllocated > 0 ? `${fin.consumptionRate.toFixed(1)}% du budget total` : 'Dépenses enregistrées',
            icon: TrendingUp,
            iconColor: 'text-emerald-600',
            iconBg: 'bg-emerald-50 border-emerald-200',
          },
          {
            label: 'Budget Restant',
            value: fin.totalAllocated > 0 ? formatFCFACompact(fin.totalRemaining) : '—',
            sub: fin.totalRemaining < 0 ? 'Dépassement global' : 'Solde disponible',
            icon: CheckCircle,
            iconColor: fin.totalRemaining < 0 ? 'text-rose-600' : 'text-indigo-600',
            iconBg: fin.totalRemaining < 0 ? 'bg-rose-50 border-rose-200' : 'bg-indigo-50 border-indigo-200',
          },
          {
            label: 'Projets en Alerte',
            value: String(fin.projectsOverBudget + fin.projectsInWarning),
            sub: `${fin.projectsOverBudget} dépassé${fin.projectsOverBudget > 1 ? 's' : ''}, ${fin.projectsInWarning} sous tension`,
            icon: AlertTriangle,
            iconColor: (fin.projectsOverBudget + fin.projectsInWarning) > 0 ? 'text-amber-600' : 'text-slate-500',
            iconBg: (fin.projectsOverBudget + fin.projectsInWarning) > 0 ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-200',
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div key={kpi.label} className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 flex flex-col justify-between shadow-xs">
              <div className="flex items-start justify-between gap-2 mb-3">
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{kpi.label}</p>
                <div className={`p-2 rounded-md border shrink-0 ${kpi.iconBg} ${kpi.iconColor}`}>
                  <Icon size={16} />
                </div>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mb-1">{kpi.value}</p>
                <p className="text-xs text-slate-500">{kpi.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contenu principal : liste projets + vue détaillée */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Colonne gauche : liste des projets */}
        <div className="lg:col-span-5 xl:col-span-4 bg-white border border-slate-200 rounded-md overflow-hidden shadow-xs">
          {/* Header de la liste */}
          <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderKanban size={16} className="text-slate-500" />
                <h3 className="font-bold text-slate-900 text-sm">Projets ({projects.length})</h3>
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative">
              <input
                type="text"
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Filtrer par nom..."
                className="w-full bg-slate-50 focus:bg-white focus:border-blue-600 border border-slate-200 pl-8 pr-3 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none rounded-md transition-colors"
              />
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              {projectSearch && (
                <button
                  onClick={() => setProjectSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Onglets filtres rapides */}
            <div className="flex gap-1.5 pt-1">
              {[
                { id: 'all', label: 'Tous' },
                { id: 'budgeted', label: 'Budgétisés' },
                { id: 'alerts', label: 'Alertes' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setProjectFilter(tab.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-colors ${
                    projectFilter === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Liste des éléments de projet */}
          <div className="divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            {filteredProjects.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                Aucun projet trouvé avec ce filtre.
              </div>
            ) : (
              filteredProjects.map((project) => {
                const spent = getTotalExpenses(project.expenses || []);
                const allocated = project.budget?.allocated ?? 0;
                const hasBudget = allocated > 0;
                const status = getBudgetStatus(project.budget?.allocated, project.expenses || []);
                const rate = getBudgetConsumptionRate(allocated, project.expenses || []);
                const barColor = getBudgetBarColor(status);
                const isSelected = activeProjectId === project.id;
                const pStatus = statusConfig[project.status];

                return (
                  <button
                    key={project.id}
                    onClick={() => setSelectedProjectId(project.id)}
                    className={`w-full text-left p-3.5 sm:p-4 transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-50/60 border-l-4 border-blue-600'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold ${pStatus?.color || 'text-slate-500'}`}>
                          {pStatus?.label || project.status}
                        </span>
                      </div>

                      <p className={`text-xs sm:text-sm font-bold truncate ${isSelected ? 'text-blue-700' : 'text-slate-900'}`}>
                        {project.title}
                      </p>

                      {(spent > 0 || hasBudget) && (
                        <div className="flex items-center justify-between text-xs pt-0.5">
                          {spent > 0 ? (
                            <>
                              <span className="text-slate-600 font-semibold">
                                {formatFCFACompact(spent)}
                                <span className="text-slate-400 font-normal"> dépensé</span>
                              </span>
                              {hasBudget && (
                                <span className="text-[11px] font-bold text-slate-500">
                                  / {formatFCFACompact(allocated)}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-medium">
                              Budget : <span className="font-bold text-slate-700">{formatFCFACompact(allocated)}</span>
                            </span>
                          )}
                        </div>
                      )}

                      {hasBudget && (
                        <div className="pt-1">
                          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${barColor}`}
                              style={{ width: `${Math.min(rate, 100)}%` }}
                            />
                          </div>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-medium">
                            <span>Consommation</span>
                            <span className={rate >= 100 ? 'text-rose-600 font-bold' : rate >= 80 ? 'text-amber-600 font-bold' : 'text-slate-600'}>
                              {rate.toFixed(0)}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    <ChevronRight
                      size={16}
                      className={`shrink-0 transition-transform ${isSelected ? 'text-blue-600 translate-x-0.5' : 'text-slate-300'}`}
                    />
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Colonne droite : détail financier du projet sélectionné */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {!selectedProject ? (
            <div className="bg-white border border-slate-200 rounded-md flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <FolderKanban size={40} className="text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">Aucun projet sélectionné</p>
              <p className="text-xs text-slate-500 mt-1">Sélectionnez un projet dans la liste pour consulter et gérer son budget.</p>
            </div>
          ) : (
            <>
              {/* En-tête du projet avec actions rapides */}
              <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${statusConfig[selectedProject.status]?.color || 'text-slate-500'}`}>
                      {statusConfig[selectedProject.status]?.label || selectedProject.status}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                    {selectedProject.title}
                  </h2>
                  <button
                    onClick={() => navigate(`/projects/${selectedProject.id}`)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Voir la fiche complète du projet <ExternalLink size={12} />
                  </button>
                </div>

                {/* Actions Administrateur */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {isAdmin && (
                    <>
                      {isEditingBudget ? (
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-slate-300 rounded-md overflow-hidden bg-white">
                            <input
                              type="number"
                              value={editBudget}
                              onChange={(e) => setEditBudget(e.target.value)}
                              className="px-3 py-1.5 text-xs w-28 sm:w-32 outline-none"
                              placeholder="Montant FCFA"
                              min="0"
                              autoFocus
                            />
                            <span className="px-2 text-[10px] font-bold text-slate-500 bg-slate-50 border-l border-slate-300">FCFA</span>
                          </div>
                          <button onClick={handleSaveBudget} className="btn btn-primary text-xs rounded-md flex items-center gap-1 px-3 py-1.5">
                            <Save size={13} /> Sauvegarder
                          </button>
                          <button onClick={() => setIsEditingBudget(false)} className="p-1.5 hover:bg-slate-100 rounded text-slate-500">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={startEditBudget}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300 font-bold text-xs rounded-md flex items-center gap-1.5 px-3 py-1.5 transition-colors cursor-pointer shadow-xs"
                        >
                          <Edit3 size={13} className="text-blue-600" />
                          {selectedProject.budget?.allocated ? 'Modifier le budget' : 'Définir un budget'}
                        </button>
                      )}

                      <button
                        onClick={() => { setEditingExpense(undefined); setShowExpenseForm(true); }}
                        className="btn btn-primary text-xs flex items-center gap-1.5 rounded-md px-3 py-1.5 shadow-xs"
                      >
                        <Plus size={14} /> Nouvelle dépense
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Vue d'ensemble du budget */}
              <BudgetOverview expenses={expenses} budget={selectedProject.budget} />

              {/* Répartition par catégorie */}
              <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 shadow-xs">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider mb-4">
                  Répartition par catégorie
                </h4>
                <BudgetChart expenses={expenses} budget={selectedProject.budget} />
              </div>

              {/* Tableau des dépenses */}
              <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider">
                    Historique des Dépenses ({expenses.length})
                  </h4>
                  {isAdmin && expenses.length > 0 && (
                    <button
                      onClick={() => { setEditingExpense(undefined); setShowExpenseForm(true); }}
                      className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1"
                    >
                      <Plus size={14} /> Ajouter une ligne
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
