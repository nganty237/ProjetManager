import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useNavigate } from 'react-router-dom';
import { statusConfig, priorityConfig, formatDate } from '@/utils/constants';
import { Calendar, TrendingUp, Users } from 'lucide-react';

const ProjectList: React.FC = () => {
  const projects = useProjectStore((state) => state.getFilteredProjects());
  const navigate = useNavigate();
  
  return (
    <div className="space-y-3">
      {projects.map((project) => {
        const status = statusConfig[project.status];
        const priority = priorityConfig[project.priority];
        
        return (
          <div
            key={project.id}
            onClick={() => navigate(`/projects/${project.id}`)}
            className="card hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-center gap-6">
              {/* Titre et description */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {project.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-1">
                  {project.description}
                </p>
              </div>
              
              {/* Badges */}
              <div className="flex gap-2 flex-shrink-0">
                <span className={`badge ${status.bgColor} ${status.color}`}>
                  {status.icon} {status.label}
                </span>
                <span className={`badge ${priority.bgColor} ${priority.color}`}>
                  {priority.icon} {priority.label}
                </span>
              </div>
              
              {/* Dates */}
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                <Calendar size={16} />
                <span>{formatDate(project.startDate)}</span>
                {project.endDate && (
                  <>
                    <span>→</span>
                    <span>{formatDate(project.endDate)}</span>
                  </>
                )}
              </div>
              
              {/* Tâches */}
              <div className="flex items-center gap-2 text-sm text-gray-600 flex-shrink-0">
                <TrendingUp size={16} />
                <span>
                  {project.tasks.filter((t) => t.status === 'done').length} /{' '}
                  {project.tasks.length}
                </span>
              </div>
              
              {/* Équipe */}
              <div className="flex items-center gap-2 flex-shrink-0">
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
              
              {/* Progression */}
              <div className="w-32 flex-shrink-0">
                <div className="flex items-center justify-between text-sm mb-1">
                  <span className="text-gray-600">Progression</span>
                  <span className="font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      })}
      
      {projects.length === 0 && (
        <div className="card text-center text-gray-500 py-12">
          Aucun projet trouvé
        </div>
      )}
    </div>
  );
};

export default ProjectList;
