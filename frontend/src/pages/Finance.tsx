import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { BudgetOverview } from '@/components/Budget/BudgetOverview';
import { ExpenseList } from '@/components/Budget/ExpenseList';
import { ExpenseForm } from '@/components/Budget/ExpenseForm';
import { FinanceProjectList } from '@/components/Budget/FinanceProjectList';
import { Edit3, Save, X, ExternalLink, FolderKanban, Plus, Receipt, PieChart } from 'lucide-react';
import { Expense } from '@/types';
import { statusConfig } from '@/utils/constants';

/**
 * Page dédiée à la gestion financière de tous les projets.
 * Permet le suivi des budgets, le contrôle des coûts et des dépenses par projet en FCFA.
 */
export function Finance() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const queryProjectId = searchParams.get('projectId');
  const { user } = useAuthStore();
  const { projects, setBudget, addExpense, updateExpense } = useProjectStore();

  const isChef = user?.role === 'CHEF_DE_PROJET';

  // Projet sélectionné
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(() => {
    return queryProjectId || (projects[0]?.id ?? null);
  });

  const [projectTab, setProjectTab] = useState<'overview' | 'expenses'>('overview');

  useEffect(() => {
    if (queryProjectId) {
      setSelectedProjectId(queryProjectId);
    } else if (!selectedProjectId && projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [queryProjectId, projects]);

  // Filtres et recherche
  const [projectSearch, setProjectSearch] = useState('');
  const [projectFilter, setProjectFilter] = useState<'all' | 'budgeted' | 'alerts'>('all');

  // Modales et édition
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const [editBudget, setEditBudget] = useState<string>('');
  const [isEditingBudget, setIsEditingBudget] = useState(false);

  // Données financières calculées
  const activeProjectId = selectedProjectId || (projects.length > 0 ? projects[0].id : null);
  const selectedProject = projects.find((p) => p.id === activeProjectId);
  const isOwner = isChef && (selectedProject?.ownerId === user?.id || !selectedProject?.ownerId);
  const canEdit = isOwner;
  const expenses = selectedProject?.expenses || [];

  /**
   * Sauvegarde du nouveau montant alloué au budget du projet actif.
   */
  const handleSaveBudget = () => {
    const val = parseFloat(editBudget);
    if (!activeProjectId || isNaN(val) || val < 0) return;
    setBudget(activeProjectId, val);
    setIsEditingBudget(false);
  };

  /**
   * Initialise la saisie de modification du budget.
   */
  const startEditBudget = () => {
    setEditBudget(String(selectedProject?.budget?.allocated ?? ''));
    setIsEditingBudget(true);
  };

  /**
   * Ajout d'une nouvelle dépense.
   */
  const handleAddExpense = (data: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => {
    if (!activeProjectId) return;
    addExpense(activeProjectId, data);
  };

  /**
   * Mise à jour d'une dépense existante.
   */
  const handleEditExpense = (data: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => {
    if (!activeProjectId || !editingExpense) return;
    updateExpense(activeProjectId, editingExpense.id, data);
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête de la page */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Gestion Financière
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-1">
          Suivi des budgets, contrôle des coûts et des dépenses par projet — FCFA
        </p>
      </div>

      {/* Contenu principal : liste des projets + vue détaillée */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Colonne gauche : liste des projets */}
        <div className="lg:col-span-5 xl:col-span-4">
          <FinanceProjectList
            projects={projects}
            selectedProjectId={activeProjectId}
            onSelectProject={setSelectedProjectId}
            search={projectSearch}
            onSearchChange={setProjectSearch}
            filter={projectFilter}
            onFilterChange={setProjectFilter}
          />
        </div>

        {/* Colonne droite : détail financier du projet sélectionné */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-5">
          {!selectedProject ? (
            <div className="bg-white border border-slate-200 rounded-md flex flex-col items-center justify-center p-12 text-center text-slate-400">
              <FolderKanban size={40} className="text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-700">Aucun projet sélectionné</p>
              <p className="text-xs text-slate-500 mt-1">
                Sélectionnez un projet dans la liste pour consulter et gérer son budget.
              </p>
            </div>
          ) : (
            <>
              {/* En-tête du projet avec actions rapides */}
              <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider ${
                        statusConfig[selectedProject.status]?.color || 'text-slate-500'
                      }`}
                    >
                      {statusConfig[selectedProject.status]?.label || selectedProject.status}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 truncate">
                    {selectedProject.title}
                  </h2>
                  <button
                    type="button"
                    onClick={() => navigate(`/projects/${selectedProject.id}`)}
                    className="text-xs text-blue-600 hover:text-blue-700 font-semibold mt-1 inline-flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Voir la fiche complète du projet <ExternalLink size={12} />
                  </button>
                </div>

                {/* Actions réservées au Chef de projet propriétaire */}
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  {canEdit && (
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
                            <span className="px-2 text-[10px] font-bold text-slate-500 bg-slate-50 border-l border-slate-300">
                              FCFA
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={handleSaveBudget}
                            className="btn btn-primary text-xs rounded-md flex items-center gap-1 px-3 py-1.5 cursor-pointer"
                          >
                            <Save size={13} /> Sauvegarder
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsEditingBudget(false)}
                            className="p-1.5 hover:bg-slate-100 rounded text-slate-500 cursor-pointer"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={startEditBudget}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-lg flex items-center gap-1.5 px-3.5 py-2 transition-colors cursor-pointer shadow-sm"
                        >
                          <Edit3 size={13} className="text-white" />
                          {selectedProject.budget?.allocated ? 'Modifier le budget' : 'Définir un budget'}
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setEditingExpense(undefined);
                          setShowExpenseForm(true);
                        }}
                        className="btn btn-primary text-xs flex items-center gap-1.5 rounded-md px-3 py-1.5 shadow-xs cursor-pointer"
                      >
                        <Plus size={14} /> Nouvelle dépense
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Onglets de vue : Synthèse / Historique */}
              <div className="flex border-b border-slate-200 gap-4">
                <button
                  type="button"
                  onClick={() => setProjectTab('overview')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    projectTab === 'overview'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <PieChart size={14} />
                  Synthèse du budget
                </button>
                <button
                  type="button"
                  onClick={() => setProjectTab('expenses')}
                  className={`pb-2.5 text-xs font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
                    projectTab === 'expenses'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <Receipt size={14} />
                  Historique des dépenses ({expenses.length})
                </button>
              </div>

              {/* Contenu selon l'onglet actif */}
              {projectTab === 'overview' ? (
                <div className="space-y-3">
                  <BudgetOverview expenses={expenses} budget={selectedProject.budget} />

                  {/* Raccourci vers l'historique ou état vide sobre */}
                  {expenses.length > 0 ? (
                    <div className="flex items-center justify-between text-xs bg-white border border-slate-200 rounded-md p-3 shadow-2xs">
                      <span className="text-slate-600 font-medium">
                        {expenses.length} dépense{expenses.length > 1 ? 's' : ''} enregistrée{expenses.length > 1 ? 's' : ''}
                      </span>
                      <button
                        type="button"
                        onClick={() => setProjectTab('expenses')}
                        className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                      >
                        Consulter l'historique complet &rarr;
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-xs bg-slate-50 border border-dashed border-slate-200 rounded-md p-3">
                      <span className="text-slate-500">Aucune dépense enregistrée sur ce projet</span>
                      {canEdit && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingExpense(undefined);
                            setShowExpenseForm(true);
                          }}
                          className="text-blue-600 hover:text-blue-700 font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={13} /> Ajouter une dépense
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                      <Receipt size={16} className="text-slate-500" />
                      Journal des Dépenses ({expenses.length})
                    </h4>
                    {canEdit && expenses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingExpense(undefined);
                          setShowExpenseForm(true);
                        }}
                        className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Plus size={14} /> Ajouter une ligne
                      </button>
                    )}
                  </div>
                  <ExpenseList
                    projectId={selectedProject.id}
                    expenses={expenses}
                    isAdmin={canEdit}
                    onAdd={() => {
                      setEditingExpense(undefined);
                      setShowExpenseForm(true);
                    }}
                    onEdit={(exp) => {
                      setEditingExpense(exp);
                      setShowExpenseForm(true);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modale d'ajout ou d'édition de dépense */}
      {showExpenseForm && selectedProject && (
        <ExpenseForm
          projectId={selectedProject.id}
          expense={editingExpense}
          onSubmit={editingExpense ? handleEditExpense : handleAddExpense}
          onClose={() => {
            setShowExpenseForm(false);
            setEditingExpense(undefined);
          }}
        />
      )}
    </div>
  );
}

export default Finance;
