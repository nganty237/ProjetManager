import React from 'react';
import { Task } from '@/types';
import { taskStatusConfig, priorityConfig, formatDate, isOverdue } from '@/utils/constants';
import { Calendar, User, Trash2, Edit } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete, onStatusChange }) => {
  const status = taskStatusConfig[task.status];
  const priority = priorityConfig[task.priority];
  const overdue = isOverdue(task.dueDate);
  
  return (
    <div className="card hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>
        <div className="flex gap-1 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded transition-colors"
            title="Modifier"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
      
      {/* Badges */}
      <div className="flex flex-wrap gap-2 mb-3">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task.id, e.target.value as Task['status'])}
          className={`badge ${status.bgColor} ${status.color} cursor-pointer text-xs`}
        >
          <option value="todo">À faire</option>
          <option value="in-progress">En cours</option>
          <option value="review">En révision</option>
          <option value="done">Terminé</option>
        </select>
        <span className={`badge ${priority.bgColor} ${priority.color}`}>
          {priority.icon} {priority.label}
        </span>
      </div>
      
      {/* Informations */}
      <div className="space-y-2 text-sm">
        {/* Assigné à */}
        {task.assignedTo && (
          <div className="flex items-center gap-2 text-gray-600">
            <User size={14} />
            <img
              src={task.assignedTo.avatar}
              alt={task.assignedTo.name}
              className="w-6 h-6 rounded-full"
            />
            <span>{task.assignedTo.name}</span>
          </div>
        )}
        
        {/* Date d'échéance */}
        {task.dueDate && (
          <div className="flex items-center gap-2">
            <Calendar size={14} />
            <span className={overdue ? 'text-red-600 font-medium' : 'text-gray-600'}>
              {formatDate(task.dueDate)}
              {overdue && ' (En retard)'}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
