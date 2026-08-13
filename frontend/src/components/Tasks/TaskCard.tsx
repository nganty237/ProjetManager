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

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  const { user } = useAuthStore();
  const priority = priorityConfig[task.priority];
  const overdue = isOverdue(task.dueDate);
  
  const canChangeStatus = user?.role === 'Administrateur' || 
    (user?.id && (task.assignedTo?.id === user.id || task.assignedToId === user.id));
  const canEditOrDelete = user?.role === 'Administrateur';
  
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 min-w-0 pr-2">
            <h4 className="font-bold text-slate-900 mb-1 leading-snug">{task.title}</h4>
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{task.description}</p>
          </div>
          {canEditOrDelete && (
            <div className="flex gap-1 shrink-0">
              <button
                onClick={() => onEdit(task)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                title="Modifier"
              >
                <Edit size={15} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Supprimer"
              >
                <Trash2 size={15} />
              </button>
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <StatusDropdown
            value={task.status}
            type="task"
            onChange={(newStatus) => onStatusChange(task.id, newStatus as Task['status'])}
            disabled={!canChangeStatus}
          />
          <span className={`badge ${priority.bgColor} ${priority.color} flex items-center gap-1 text-xs font-semibold`}>
            {priority.icon} {priority.label}
          </span>
        </div>
      </div>
      
      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
        {/* Assigné à */}
        {task.assignedTo ? (
          <div className="flex items-center gap-2 min-w-0">
            <UserAvatar name={task.assignedTo.name} avatar={task.assignedTo.avatar} size="xs" />
            <span className="truncate font-medium text-slate-700">{task.assignedTo.name}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">Non assignée</span>
        )}
        
        {/* Date d'échéance */}
        {task.dueDate && (
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Calendar size={13} className={overdue ? 'text-rose-500' : 'text-slate-400'} />
            <span className={overdue ? 'text-rose-600 font-semibold' : 'text-slate-500 font-medium'}>
              {formatDate(task.dueDate)}
              {overdue && ' !'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
