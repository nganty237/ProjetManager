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
} from 'lucide-react';
import React, { useState } from 'react';
import {
  statusConfig,
  priorityConfig,
  formatDate,
  getDaysRemaining,
  isOverdue,
} from '@/utils/constants';
import TaskCard from '@/components/Tasks/TaskCard';
import TaskForm from '@/components/Tasks/TaskForm';
import ProjectForm from '@/components/Projects/ProjectForm';

const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Administrateur';
  const { getProjectById, deleteProject, addTask, updateTask, deleteTask } =
    useProjectStore();
  
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  
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
  
  const status = statusConfig[project.status];
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
  
  const handleTaskStatusChange = (taskId: string, newStatus: any) => {
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
      
      {/* ... reste du code ... */}
      
      {/* Badges et alertes */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <span className={`badge ${status.bgColor} ${status.color} text-xs sm:text-sm`}>
          {status.icon} {status.label}
        </span>
        <span className={`badge ${priority.bgColor} ${priority.color} text-xs sm:text-sm`}>
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
          <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
            {project.team.map((member) => (
              <div key={member.id} className="flex items-center gap-2">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {member.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Statistiques des tâches */}
      <div className="card overflow-x-auto">
        <h3 className="font-semibold text-gray-900 mb-4 whitespace-nowrap">Statistiques des tâches</h3>
        <div className="flex sm:grid sm:grid-cols-5 gap-4 min-w-[500px] sm:min-w-0">
          <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-gray-900">{taskStats.total}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total</div>
          </div>
          <div className="flex-1 text-center p-2 bg-gray-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-gray-500">{taskStats.todo}</div>
            <div className="text-xs sm:text-sm text-gray-600">À faire</div>
          </div>
          <div className="flex-1 text-center p-2 bg-blue-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">{taskStats.inProgress}</div>
            <div className="text-xs sm:text-sm text-gray-600">En cours</div>
          </div>
          <div className="flex-1 text-center p-2 bg-yellow-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-yellow-600">{taskStats.review}</div>
            <div className="text-xs sm:text-sm text-gray-600">En révision</div>
          </div>
          <div className="flex-1 text-center p-2 bg-green-50 rounded-lg">
            <div className="text-xl sm:text-2xl font-bold text-green-600">{taskStats.done}</div>
            <div className="text-xs sm:text-sm text-gray-600">Terminées</div>
          </div>
        </div>
      </div>
      
      {/* Tâches */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
            Tâches ({project.tasks.length})
          </h2>
          {isAdmin && (
            <button
              onClick={() => {
                setEditingTask(null);
                setShowTaskForm(true);
              }}
              className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto text-sm"
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
          <div className="card text-center text-gray-500 py-12">
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
