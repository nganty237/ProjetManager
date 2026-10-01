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
  FileDown,
  Receipt,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import {
  priorityConfig,
  formatDate,
  getDaysRemaining,
  isOverdue,
} from '@/utils/constants';
import { generateProjectPdfReport } from '@/utils/projectPdfReport';
import { TaskCard } from '@/components/Tasks/TaskCard';
import { TaskForm } from '@/components/Tasks/TaskForm';
import { ProjectForm } from '@/components/Projects/ProjectForm';
import { UserAvatar } from '@/components/Common/UserAvatar';
import { StatusDropdown } from '@/components/Common/StatusDropdown';
import { BudgetOverview } from '@/components/Budget/BudgetOverview';
import { ExpenseList } from '@/components/Budget/ExpenseList';

export function ProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { getProjectById, updateProject, deleteProject, addTask, updateTask, deleteTask, teamMembers } =
    useProjectStore();
  
  const project = id ? getProjectById(id) : null;
  const isOwner = user?.role === 'CHEF_DE_PROJET' && (project?.ownerId === user?.id || !project?.ownerId);
  const isMember = user?.role === 'MEMBRE';
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [selectedTaskStatus, setSelectedTaskStatus] = useState<'all' | 'todo' | 'in-progress' | 'review' | 'done'>('all');
  const [showExpenses, setShowExpenses] = useState(false);

  // Membres éligibles pour l'assignation de tâches (Chef de projet propriétaire + équipe du projet + membres)
  const assignableMembers = useMemo(() => {
    if (!project) return [];
    const list: any[] = [];
    if (project.owner) {
      list.push(project.owner);
    }
    if (project.team && Array.isArray(project.team)) {
      project.team.forEach((m) => {
        if (!list.some((existing) => existing.id === m.id)) {
          list.push(m);
        }
      });
    }
    if (teamMembers && Array.isArray(teamMembers)) {
      teamMembers.forEach((m) => {
        if (!list.some((existing) => existing.id === m.id)) {
          list.push(m);
        }
      });
    }
    return list;
  }, [project, teamMembers]);

  const handleExportPdf = () => {
    if (!project) return;
    try {
      setIsExportingPdf(true);
      generateProjectPdfReport(project);
    } catch (err) {
      console.error("Erreur lors de l'export PDF:", err);
      alert("Une erreur est survenue lors de la génération du rapport PDF.");
    } finally {
      setIsExportingPdf(false);
    }
  };
  
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
    if (!isOwner) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
      deleteProject(project.id);
      navigate('/projects');
    }
  };
  
  const handleEditTask = (task: any) => {
    if (!isOwner) return;
    setEditingTask(task);
    setShowTaskForm(true);
  };
  
  const handleUpdateTask = (taskData: any) => {
    if (!isOwner) return;
    if (editingTask) {
      updateTask(project.id, editingTask.id, taskData);
      setEditingTask(null);
    } else {
      addTask(project.id, taskData);
    }
  };
  
  const handleDeleteTask = (taskId: string) => {
    if (!isOwner) return;
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
      deleteTask(project.id, taskId);
    }
  };
  
  const handleProjectStatusChange = (newStatus: any) => {
    if (!isOwner) return;
    updateProject(project.id, { status: newStatus });
  };

  const handleTaskStatusChange = (taskId: string, newStatus: any) => {
    const task = project.tasks.find((t) => t.id === taskId);
    const canChangeStatus = isOwner || (user?.id && (task?.assignedTo?.id === user.id || task?.assignedToId === user.id));
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

  // Tâches filtrées par le statut sélectionné
  const filteredTasks = selectedTaskStatus === 'all'
    ? project.tasks
    : project.tasks.filter((t) => t.status === selectedTaskStatus);
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-start gap-3 sm:gap-4 flex-1 min-w-0">
          <button
            onClick={() => navigate('/projects')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors mt-0.5 shrink-0"
            title="Retour aux projets"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <h1
              className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-1 truncate"
              title={project.title}
            >
              {project.title}
            </h1>
            {project.description && (
              <p className="text-slate-500 text-sm sm:text-base line-clamp-2">{project.description}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 shrink-0 sm:self-start">
          <button
            onClick={handleExportPdf}
            disabled={isExportingPdf}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center justify-center gap-2 text-sm px-3.5 py-2 rounded-lg transition-colors cursor-pointer disabled:opacity-50 shadow-sm shrink-0"
            title="Exporter le rapport exécutif du projet en PDF"
          >
            <FileDown size={17} className="text-white" />
            <span>{isExportingPdf ? 'Export...' : 'Rapport PDF'}</span>
          </button>

          {isOwner && (
            <>
              <button
                onClick={() => setShowProjectForm(true)}
                className="btn btn-secondary flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={handleDeleteProject}
                className="btn btn-danger flex items-center justify-center gap-2 text-sm shrink-0 cursor-pointer"
              >
                <Trash2 size={16} />
                Supprimer
              </button>
            </>
          )}
        </div>
      </div>
      
      {/* Statut, priorité et alertes */}
      <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-semibold">
        <StatusDropdown
          value={project.status}
          type="project"
          onChange={handleProjectStatusChange}
          disabled={!isOwner}
        />
        <span className="text-slate-300">•</span>
        <span className={`inline-flex items-center gap-1.5 ${priority.color}`}>
          {priority.icon} {priority.label}
        </span>
        {overdue && (
          <>
            <span className="text-slate-300">•</span>
            <span className="text-rose-600 font-bold inline-flex items-center gap-1">
              <AlertCircle size={14} />
              Retard: {Math.abs(daysRemaining!)} j
            </span>
          </>
        )}
      </div>
      
      {/* Informations principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Dates */}
        <div className="card">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-[#2563EB] text-white rounded-md shrink-0">
              <Calendar size={18} />
            </div>
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
            <div className="p-2 bg-[#6366F1] text-white rounded-md shrink-0">
              <Users size={18} />
            </div>
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
      
      {/* Statistiques et filtres des tâches */}
      <div className="card overflow-x-auto">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider whitespace-nowrap">
            Filtres par statut
          </h3>
          {selectedTaskStatus !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedTaskStatus('all')}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
            >
              Afficher tout ({taskStats.total})
            </button>
          )}
        </div>
        <div className="flex sm:grid sm:grid-cols-5 gap-3 min-w-[500px] sm:min-w-0">
          <button
            type="button"
            onClick={() => setSelectedTaskStatus('all')}
            className={`flex-1 text-center p-3 rounded-md border transition-all cursor-pointer ${
              selectedTaskStatus === 'all'
                ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Afficher toutes les tâches"
          >
            <div className="text-xl sm:text-2xl font-bold">{taskStats.total}</div>
            <div className={`text-xs ${selectedTaskStatus === 'all' ? 'text-slate-300' : 'text-slate-500'}`}>Toutes</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTaskStatus('todo')}
            className={`flex-1 text-center p-3 rounded-md border transition-all cursor-pointer ${
              selectedTaskStatus === 'todo'
                ? 'bg-slate-800 text-white border-slate-800 shadow-sm'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Filtrer les tâches À faire"
          >
            <div className={`text-xl sm:text-2xl font-bold ${selectedTaskStatus === 'todo' ? 'text-white' : 'text-slate-600'}`}>{taskStats.todo}</div>
            <div className={`text-xs ${selectedTaskStatus === 'todo' ? 'text-slate-300' : 'text-slate-500'}`}>À faire</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTaskStatus('in-progress')}
            className={`flex-1 text-center p-3 rounded-md border transition-all cursor-pointer ${
              selectedTaskStatus === 'in-progress'
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white hover:bg-blue-50/40 border-slate-200 text-slate-700'
            }`}
            title="Filtrer les tâches En cours"
          >
            <div className={`text-xl sm:text-2xl font-bold ${selectedTaskStatus === 'in-progress' ? 'text-white' : 'text-blue-600'}`}>{taskStats.inProgress}</div>
            <div className={`text-xs ${selectedTaskStatus === 'in-progress' ? 'text-blue-100' : 'text-slate-500'}`}>En cours</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTaskStatus('review')}
            className={`flex-1 text-center p-3 rounded-md border transition-all cursor-pointer ${
              selectedTaskStatus === 'review'
                ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                : 'bg-white hover:bg-amber-50/40 border-slate-200 text-slate-700'
            }`}
            title="Filtrer les tâches En révision"
          >
            <div className={`text-xl sm:text-2xl font-bold ${selectedTaskStatus === 'review' ? 'text-white' : 'text-amber-600'}`}>{taskStats.review}</div>
            <div className={`text-xs ${selectedTaskStatus === 'review' ? 'text-amber-100' : 'text-slate-500'}`}>En révision</div>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTaskStatus('done')}
            className={`flex-1 text-center p-3 rounded-md border transition-all cursor-pointer ${
              selectedTaskStatus === 'done'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                : 'bg-white hover:bg-emerald-50/40 border-slate-200 text-slate-700'
            }`}
            title="Filtrer les tâches Terminées"
          >
            <div className={`text-xl sm:text-2xl font-bold ${selectedTaskStatus === 'done' ? 'text-white' : 'text-emerald-600'}`}>{taskStats.done}</div>
            <div className={`text-xs ${selectedTaskStatus === 'done' ? 'text-emerald-100' : 'text-slate-500'}`}>Terminées</div>
          </button>
        </div>
      </div>

      {/* Section Budget (réservée Chef de projet et Admin) */}
      {!isMember && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
              <div className="p-2 bg-[#16A34A] text-white rounded-md shrink-0">
                <Wallet size={18} />
              </div>
              Budget & Finances
            </h2>
            <div className="flex items-center gap-3">
              {(project.expenses?.length || 0) > 0 && (
                <button
                  type="button"
                  onClick={() => setShowExpenses(!showExpenses)}
                  className="text-xs text-slate-700 hover:text-slate-900 font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer px-3 py-1.5 rounded-md border border-slate-200 bg-white hover:bg-slate-50 shadow-2xs"
                >
                  <Receipt size={14} className="text-slate-500" />
                  {showExpenses ? 'Masquer les dépenses' : `Voir les dépenses (${project.expenses?.length || 0})`}
                </button>
              )}
              {isOwner && (
                <button
                  onClick={() => navigate(`/finance?projectId=${project.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  Gérer dans Finances &rarr;
                </button>
              )}
            </div>
          </div>

          <BudgetOverview expenses={project.expenses || []} budget={project.budget} />

          {showExpenses && (
            <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5 shadow-xs mt-3">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-slate-900 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-2">
                  <Receipt size={16} className="text-slate-500" />
                  Journal des Dépenses ({project.expenses?.length || 0})
                </h4>
              </div>
              <ExpenseList
                projectId={project.id}
                expenses={project.expenses || []}
                isAdmin={isOwner}
                onEdit={() => navigate(`/finance?projectId=${project.id}`)}
              />
            </div>
          )}
        </div>
      )}

      {/* Tâches */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Tâches ({filteredTasks.length}{selectedTaskStatus !== 'all' ? ` sur ${project.tasks.length}` : ''})
          </h2>
          {isOwner && (
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm rounded-md cursor-pointer"
            >
              <PlusCircle size={20} />
              Nouvelle Tâche
            </button>
          )}
        </div>
        
        {filteredTasks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
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
            {selectedTaskStatus !== 'all' ? (
              <div className="space-y-2">
                <p className="text-sm text-slate-600">Aucune tâche avec ce statut</p>
                <button
                  type="button"
                  onClick={() => setSelectedTaskStatus('all')}
                  className="text-xs text-blue-600 font-semibold hover:underline cursor-pointer"
                >
                  Afficher toutes les tâches ({taskStats.total})
                </button>
              </div>
            ) : (
              'Aucune tâche pour ce projet'
            )}
          </div>
        )}
      </div>
      
      {/* Modals */}
      {showTaskForm && (
        <TaskForm
          task={editingTask}
          teamMembers={assignableMembers}
          onSubmit={handleUpdateTask}
          onClose={() => {
            setShowTaskForm(false);
            setEditingTask(null);
          }}
        />
      )}

      {showProjectForm && (
        <ProjectForm project={project} onClose={() => setShowProjectForm(false)} />
      )}
    </div>
  );
};

export default ProjectDetail;
