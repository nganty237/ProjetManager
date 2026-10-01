import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { StatusDropdown } from '@/components/Common/StatusDropdown';
import { Task } from '@/types';
import { priorityConfig, formatDate, isOverdue } from '@/utils/constants';
import { CheckSquare, FolderKanban, Calendar, ChevronRight } from 'lucide-react';

/**
 * Page "Mes Tâches" - affiche toutes les tâches assignées au membre connecté,
 * regroupées par projet, avec possibilité de changer le statut.
 */
export function MyTasks() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { projects, updateTask } = useProjectStore();

  // Récupère toutes les tâches assignées à l'utilisateur connecté dans tous ses projets
  const myTaskGroups = projects
    .map((project) => {
      const tasks = (project.tasks || []).filter(
        (t) => t.assignedTo?.id === user?.id || t.assignedToId === user?.id
      );
      return { project, tasks };
    })
    .filter((group) => group.tasks.length > 0);

  const totalTasks = myTaskGroups.reduce((sum, g) => sum + g.tasks.length, 0);
  const doneTasks = myTaskGroups.reduce(
    (sum, g) => sum + g.tasks.filter((t) => t.status === 'done').length,
    0
  );

  const handleStatusChange = (projectId: string, taskId: string, newStatus: Task['status']) => {
    updateTask(projectId, taskId, { status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-blue-600 text-white rounded-md shrink-0">
              <CheckSquare size={20} />
            </div>
            Mes Tâches
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {totalTasks === 0
              ? 'Aucune tâche ne vous est assignée pour le moment.'
              : `${doneTasks} terminée${doneTasks > 1 ? 's' : ''} sur ${totalTasks} tâche${totalTasks > 1 ? 's' : ''} assignée${totalTasks > 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Contenu */}
      {myTaskGroups.length === 0 ? (
        <div className="card text-center py-16">
          <CheckSquare size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="font-bold text-slate-700">Aucune tâche assignée</p>
          <p className="text-xs text-slate-400 mt-1">
            Le chef de projet vous assignera des tâches prochainement.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {myTaskGroups.map(({ project, tasks }) => (
            <div key={project.id} className="bg-white border border-slate-200 rounded-md shadow-xs">
              {/* En-tête du projet */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50 rounded-t-md">
                <div className="flex items-center gap-2">
                  <FolderKanban size={15} className="text-slate-400 shrink-0" />
                  <span className="font-bold text-slate-900 text-sm">{project.title}</span>
                  <span className="text-[11px] text-slate-400 font-medium">
                    ({tasks.length} tâche{tasks.length > 1 ? 's' : ''})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="text-xs text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-0.5 cursor-pointer"
                >
                  Voir le projet <ChevronRight size={13} />
                </button>
              </div>

              {/* Liste des tâches */}
              <div className="divide-y divide-slate-100">
                {tasks.map((task) => {
                  const priority = priorityConfig[task.priority];
                  const overdue = isOverdue(task.dueDate) && task.status !== 'done';
                  return (
                    <div key={task.id} className="px-4 py-3 flex items-center gap-4">
                      {/* Statut cliquable */}
                      <div className="shrink-0">
                        <StatusDropdown
                          value={task.status}
                          type="task"
                          onChange={(newStatus) =>
                            handleStatusChange(project.id, task.id, newStatus as Task['status'])
                          }
                          disabled={false}
                        />
                      </div>

                      {/* Titre + description */}
                      <div className="flex-1 min-w-0">
                        <p className={`font-semibold text-sm truncate ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">{task.description}</p>
                        )}
                      </div>

                      {/* Priorité */}
                      <span className={`hidden sm:inline-flex items-center gap-1 text-xs font-semibold shrink-0 ${priority.color}`}>
                        {priority.icon} {priority.label}
                      </span>

                      {/* Échéance */}
                      <div className={`hidden sm:flex items-center gap-1 text-xs shrink-0 ${overdue ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
                        <Calendar size={13} />
                        {task.dueDate ? formatDate(task.dueDate) : '—'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTasks;
