import React from 'react';
import { Project } from '@/types';
import { statusConfig, priorityConfig, formatDate, getDaysRemaining, isOverdue } from '@/utils/constants';
import { Calendar, TrendingUp, Users, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();
  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];
  const daysRemaining = project.endDate ? getDaysRemaining(project.endDate) : null;
  const overdue = isOverdue(project.endDate, project.status);
  
  const handleClick = () => {
    navigate(`/projects/${project.id}`);
  };
  
  return (
    <div
      onClick={handleClick}
      className="card hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {project.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">
            {project.description}
          </p>
        </div>
      </div>
      
      {/* Badges */}
      <div className="flex gap-2 mb-4">
        <span className={`badge ${status.bgColor} ${status.color}`}>
          {status.icon} {status.label}
        </span>
        <span className={`badge ${priority.bgColor} ${priority.color}`}>
          {priority.icon} {priority.label}
        </span>
      </div>
      
      {/* Informations */}
      <div className="space-y-2 mb-4">
        {/* Dates */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>{formatDate(project.startDate)}</span>
          {project.endDate && (
            <>
              <span>→</span>
              <span className={overdue ? 'text-red-600 font-medium' : ''}>
                {formatDate(project.endDate)}
              </span>
            </>
          )}
        </div>
        
        {/* Jours restants */}
        {daysRemaining !== null && project.status !== 'completed' && (
          <div className="flex items-center gap-2 text-sm">
            {overdue ? (
              <span className="text-red-600 font-medium flex items-center gap-1">
                <AlertCircle size={16} />
                En retard de {Math.abs(daysRemaining)} jours
              </span>
            ) : (
              <span className="text-gray-600">
                {daysRemaining} jours restants
              </span>
            )}
          </div>
        )}
        
        {/* Tâches */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <TrendingUp size={16} />
          <span>
            {project.tasks.filter((t) => t.status === 'done').length} / {project.tasks.length} tâches
          </span>
        </div>
      </div>
      
      {/* Équipe */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Users size={16} className="text-gray-500" />
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-white"
                title={member.name}
              />
            ))}
            {project.team.length > 3 && (
              <div className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                +{project.team.length - 3}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
