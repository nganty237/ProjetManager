import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  Edit,
  PlusCircle,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react';
import { useState } from 'react';
import {
  priorityConfig,
  formatDate,
  getDaysRemaining,
  isOverdue,
} from '@/utils/constants';
import { TaskCard } from '@/components/Tasks/TaskCard';
import { TaskForm } from '@/components/Tasks/TaskForm';
import { ProjectForm } from '@/components/Projects/ProjectForm';
import { UserAvatar } from '@/components/Common/UserAvatar';
import { StatusDropdown } from '@/components/Common/StatusDropdown';
import { BudgetOverview } from '@/components/Budget/BudgetOverview';
import { BudgetChart } from '@/components/Budget/BudgetChart';
import { ExpenseList } from '@/components/Budget/ExpenseList';
import { ExpenseForm } from '@/components/Budget/ExpenseForm';
import { Expense } from '@/types';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Administrateur';
  const { getProjectById, updateProject, deleteProject, addTask, updateTask, deleteTask } =
    useProjectStore();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | undefined>(undefined);
  const { addExpense, updateExpense } = useProjectStore();
  
  const project = id ? getProjectById(id) : null;
  
  if (!project) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 mb-4">Projet non trouvé</p>
        <button onClick={() => navigate('/projects')} className="btn btn-primary">
          Retour aux projets
        </button>
      </div>
    );
  }
  
  const priority = priorityConfig[project.priority];
  const daysRemaining = project.endDate ? getDaysRemaining(project.endDate) : null;
  const overdue = isOverdue(project.endDate, project.status);
  
  const handleDeleteProject = () => {
    if (!isAdmin) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(project.id);
      navigate('/projects');
    }
  };
  
  const handleEditTask = (task: any) => {
    if (!isAdmin) return;
    setEditingTask(task);
    setShowTaskForm(true);
  };
  
  const handleUpdateTask = (taskData: any) => {
    if (!isAdmin) return;
    if (editingTask) {
      updateTask(project.id, editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(project.id, taskData);
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (!isAdmin) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTask(project.id, taskId);
    }
  };
  
  const handleProjectStatusChange = (newStatus: any) => {
    if (!isAdmin) return;
    updateProject(project.id, { status: newStatus });
  };

  const handleTaskStatusChange = (taskId: string, newStatus: any) => {
    const task = project.tasks.find((t) => t.id === taskId);
    const canChangeStatus = isAdmin || (user?.id && (task?.assignedTo?.id === user.id || task?.assignedToId === user.id));
    if (!canChangeStatus) return;
    updateTask(project.id, taskId, { status: newStatus });
  };
  
  // Statistiques des tâches
  const taskStats = {
    total: project.tasks.length,
    todo: project.tasks.filter((t) => t.status === 'todo').length,
    inProgress: project.tasks.filter((t) => t.status === 'in-progress').length,
    review: project.tasks.filter((t) => t.status === 'review').length,
    done: project.tasks.filter((t) => t.status === 'done').length,
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-1 flex-shrink-0"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 truncate">{project.title}</h1>
            <p className="text-gray-600 text-sm sm:text-base">{project.description}</p>
          </div>
        </div>
        
        {isAdmin && (
          <div className="flex gap-2 sm:self-start">
            <button
              onClick={() => setShowProjectForm(true)}
              className="btn btn-secondary flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm"
            >
              <Edit size={18} />
              Modifier
            </button>
            <button
              onClick={handleDeleteProject}
              className="btn btn-danger flex-1 sm:flex-none flex items-center justify-center gap-2 text-sm"
            >
              <Trash2 size={18} />
              Supprimer
            </button>
          </div>
        )}
      </div>
      
      {/* Badges et alertes */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <StatusDropdown
          value={project.status}
          type="project"
          onChange={handleProjectStatusChange}
          disabled={!isAdmin}
        />
        <span className={`badge ${priority.bgColor} ${priority.color} text-xs sm:text-sm flex items-center gap-1.5`}>
          {priority.icon} {priority.label}
        </span>
        {overdue && (
          <span className="badge bg-red-100 text-red-700 text-xs sm:text-sm flex items-center gap-1">
            <AlertCircle size={14} />
            Retard: {Math.abs(daysRemaining!)} j
          </span>
        )}
      </div>
      
      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Dates */}
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Calendar className="text-primary-600 flex-shrink-0" size={20} />
            <h3 className="font-semibold text-gray-900">Dates</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between sm:block">
              <span className="text-gray-600">Début: </span>
              <span className="font-medium">{formatDate(project.startDate)}</span>
            </div>
            {project.endDate && (
              <div className="flex justify-between sm:block">
                <span className="text-gray-600">Fin: </span>
                <span className={`font-medium ${overdue ? 'text-red-600' : ''}`}>
                  {formatDate(project.endDate)}
                </span>
              </div>
            )}
            {daysRemaining !== null && project.status !== 'completed' && (
              <div className="pt-2 border-t border-gray-200 flex justify-between sm:block">
                <span className="text-gray-600">
                  {overdue ? 'Retard: ' : 'Restant: '}
                </span>
                <span className={`font-medium ${overdue ? 'text-red-600' : ''}`}>
                  {Math.abs(daysRemaining)} jours
                </span>
              </div>
            )}
          </div>
        </div>
        
        {/* Équipe */}
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <Users className="text-purple-600 flex-shrink-0" size={20} />
            <h3 className="font-semibold text-gray-900">Équipe</h3>
          </div>
          <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
            {project.team.map((member) => (
              <div key={member.id} className="flex items-center gap-3 p-1.5 hover:bg-slate-50 rounded-md transition-colors">
                <UserAvatar name={member.name} avatar={member.avatar} size="sm" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-slate-800 truncate">
                    {member.name}
                  </div>
                  <div className="text-xs text-slate-400 truncate">{member.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Statistiques des tâches */}
      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-slate-900 mb-4 whitespace-nowrap">Statistiques des tâches</h3>
        <div className="flex sm:grid sm:grid-cols-5 gap-4 min-w-[500px] sm:min-w-0">
          <div className="flex-1 text-center p-2 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-xl sm:text-2xl font-bold text-slate-900">{taskStats.total}</div>
            <div className="text-xs sm:text-sm text-slate-600">Total</div>
          </div>
          <div className="flex-1 text-center p-2 bg-slate-50 rounded-md border border-slate-200">
            <div className="text-xl sm:text-2xl font-bold text-slate-500">{taskStats.todo}</div>
            <div className="text-xs sm:text-sm text-slate-600">À faire</div>
          </div>
          <div className="flex-1 text-center p-2 bg-blue-50 rounded-md border border-blue-200">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <div className="text-xs sm:text-sm text-slate-600">En cours</div>
          </div>
          <div className="flex-1 text-center p-2 bg-amber-50 rounded-md border border-amber-200">
            <div className="text-xl sm:text-2xl font-bold text-amber-600">{taskStats.review}</div>
            <div className="text-xs sm:text-sm text-slate-600">En révision</div>
          </div>
          <div className="flex-1 text-center p-2 bg-emerald-50 rounded-md border border-emerald-200">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600">{taskStats.done}</div>
            <div className="text-xs sm:text-sm text-slate-600">Terminées</div>
          </div>
        </div>
      </div>

      {/* Section Budget & Dépenses */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wallet size={22} className="text-emerald-600" />
            Budget & Dépenses
          </h2>
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={() => { setEditingExpense(undefined); setShowExpenseForm(true); }}
                className="btn btn-primary flex items-center gap-2 text-sm rounded-md"
              >
                <PlusCircle size={16} /> Ajouter une dépense
              </button>
            </div>
          )}
        </div>

        <BudgetOverview expenses={project.expenses || []} budget={project.budget} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <h4 className="font-bold text-slate-900 text-sm mb-4">Répartition par catégorie</h4>
            <BudgetChart expenses={project.expenses || []} budget={project.budget} />
          </div>
          <div className="bg-white border border-slate-200 rounded-md p-4">
            <h4 className="font-bold text-slate-900 text-sm mb-1">Dépenses récentes</h4>
            <p className="text-xs text-slate-400 mb-3">3 dernières dépenses enregistrées</p>
            {(project.expenses || []).length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-8">Aucune dépense</p>
            ) : (
              <div className="space-y-2">
                {[...(project.expenses || [])]
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 3)
                  .map((exp) => (
                    <div key={exp.id} className="flex items-center justify-between text-xs py-2 border-b border-slate-100 last:border-0">
                      <span className="font-semibold text-slate-800 truncate mr-2">{exp.label}</span>
                      <span className="font-bold text-slate-700 whitespace-nowrap">
                        {new Intl.NumberFormat('fr-FR').format(exp.amount)} FCFA
                      </span>
                    </div>
                  ))
                }
              </div>
            )}
          </div>
        </div>

        <ExpenseList
          projectId={project.id}
          expenses={project.expenses || []}
          isAdmin={isAdmin}
          onAdd={() => { setEditingExpense(undefined); setShowExpenseForm(true); }}
          onEdit={(exp) => { setEditingExpense(exp); setShowExpenseForm(true); }}
        />
      </div>

      {/* Tâches */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Tâches ({project.tasks.length})
          </h2>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm rounded-md"
            >
              <PlusCircle size={20} />
              Nouvelle Tâche
            </button>
          )}
        </div>
        
        {project.tasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {project.tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
                onStatusChange={handleTaskStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="card text-center text-slate-400 py-12">
            Aucune tâche pour ce projet
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          teamMembers={project.team}
          onSubmit={handleUpdateTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {showExpenseForm && (
        <ExpenseForm
          projectId={project.id}
          expense={editingExpense}
          onSubmit={(data) => {
            if (editingExpense) {
              updateExpense(project.id, editingExpense.id, data);
            } else {
              addExpense(project.id, data);
            }
          }}
          onClose={() => { setShowExpenseForm(false); setEditingExpense(undefined); }}
        />
      )}
      
      {showProjectForm && (
        <ProjectForm project={project} onClose={() => setShowProjectForm(false)} />
      )}
    </div>
  );
};

export default ProjectDetail;
