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
} from 'lucide-react';
import { useState } from 'react';
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
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  
  const project = id ? getProjectById(id) : null;

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

          {isAdmin && (
            <>
              <button
                onClick={() => setShowProjectForm(true)}
                className="btn btn-secondary flex items-center justify-center gap-2 text-sm shrink-0"
              >
                <Edit size={16} />
                Modifier
              </button>
              <button
                onClick={handleDeleteProject}
                className="btn btn-danger flex items-center justify-center gap-2 text-sm shrink-0"
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
          disabled={!isAdmin}
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
          <div className="flex-1 text-center p-2 bg-[#2563EB]/10 rounded-md border border-[#2563EB]/20">
            <div className="text-xl sm:text-2xl font-bold text-[#2563EB]">{taskStats.inProgress}</div>
            <div className="text-xs sm:text-sm text-slate-600">En cours</div>
          </div>
          <div className="flex-1 text-center p-2 bg-[#D97706]/10 rounded-md border border-[#D97706]/20">
            <div className="text-xl sm:text-2xl font-bold text-[#D97706]">{taskStats.review}</div>
            <div className="text-xs sm:text-sm text-slate-600">En révision</div>
          </div>
          <div className="flex-1 text-center p-2 bg-[#16A34A]/10 rounded-md border border-[#16A34A]/20">
            <div className="text-xl sm:text-2xl font-bold text-[#16A34A]">{taskStats.done}</div>
            <div className="text-xs sm:text-sm text-slate-600">Terminées</div>
          </div>
        </div>
      </div>

      {/* Section Budget */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2.5">
            <div className="p-2 bg-[#16A34A] text-white rounded-md shrink-0">
              <Wallet size={18} />
            </div>
            Budget & Finances
          </h2>
          <button
            onClick={() => navigate(`/finance?projectId=${project.id}`)}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 transition-colors cursor-pointer"
          >
            Gérer les dépenses dans la section Finances &rarr;
          </button>
        </div>

        <BudgetOverview expenses={project.expenses || []} budget={project.budget} />
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

      {showProjectForm && (
        <ProjectForm project={project} onClose={() => setShowProjectForm(false)} />
      )}
    </div>
  );
};

export default ProjectDetail;
