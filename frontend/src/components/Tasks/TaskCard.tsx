import { Task } from '@/types';
import { priorityConfig, formatDate, isOverdue } from '@/utils/constants';
import { Calendar, Trash2, Edit } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { UserAvatar } from '@/components/Common/UserAvatar';
import { StatusDropdown } from '@/components/Common/StatusDropdown';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

/**
 * Task card component for displaying individual task details with subtle rounded styling.
 */
export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const { user } = useAuthStore();
  const priority = priorityConfig[task.priority];
  const overdue = isOverdue(task.dueDate);

  const canChangeStatus = user?.role === 'Administrateur' ||
    (user?.id && (task.assignedTo?.id === user.id || task.assignedToId === user.id));
  const canEditOrDelete = user?.role === 'Administrateur';

  return (
    <div className="bg-white rounded-md border border-slate-200 p-4 sm:p-5 flex flex-col justify-between hover:border-slate-300 transition-colors">
      <div>
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-bold text-slate-900 mb-1 leading-snug">{task.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>
          </div>
          {canEditOrDelete && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                title="Modifier"
              >
                <Edit size={15} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                title="Supprimer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <StatusDropdown
            value={task.status}
            type="task"
            onChange={(newStatus) => onStatusChange(task.id, newStatus as Task['status'])}
            disabled={!canChangeStatus}
          />
          <span className={`badge ${priority.bgColor} ${priority.color}`}>
            {priority.icon} {priority.label}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
        <div className="flex items-center gap-1.5 text-slate-500">
          <Calendar size={14} className="text-slate-400" />
          <span className={overdue && task.status !== 'done' ? 'text-rose-600 font-bold' : ''}>
            {task.dueDate ? formatDate(task.dueDate) : 'Pas d\'échéance'}
          </span>
        </div>

        {task.assignedTo ? (
          <div className="flex items-center gap-1.5">
            <UserAvatar name={task.assignedTo.name} avatar={task.assignedTo.avatar} size="xs" />
            <span className="text-slate-700 font-medium truncate max-w-[100px]">
              {task.assignedTo.name}
            </span>
          </div>
        ) : (
          <span className="text-slate-400 italic">Non assignée</span>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
