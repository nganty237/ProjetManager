import { useProjectStore } from '@/store/projectStore';
import { useNavigate } from 'react-router-dom';
import { statusConfig, priorityConfig, formatDate } from '@/utils/constants';
import { Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { UserAvatar } from '@/components/Common/UserAvatar';

/**
 * List component for displaying projects in a structured table row view.
 */
export function ProjectList() {
  const { getFilteredProjects } = useProjectStore();
  const projects = getFilteredProjects();
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="divide-y divide-slate-100">
        {projects.map((project) => {
          const status = statusConfig[project.status];
          const priority = priorityConfig[project.priority];
          const completedTasksCount = project.tasks.filter((t) => t.status === 'done').length;

          return (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="p-4 sm:p-5 hover:bg-slate-50/80 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2.5 mb-1">
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                    {project.title}
                  </h3>
                  <span className={`badge ${priority.bgColor} ${priority.color} text-[10px] font-bold`}>
                    {priority.label}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">
                  {project.description || 'Aucune description'}
                </p>
              </div>

              <div className="shrink-0">
                <span className={`badge ${status.bgColor} ${status.color} text-xs font-semibold flex items-center gap-1.5`}>
                  {status.icon} {status.label}
                </span>
              </div>

              <div className="flex items-center justify-between md:justify-end gap-5 text-xs text-slate-500 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="flex items-center gap-1.5 font-medium whitespace-nowrap">
                  <Calendar size={14} className="text-slate-400 shrink-0" />
                  <span>{project.endDate ? formatDate(project.endDate) : '-'}</span>
                </div>

                <div className="flex items-center gap-1.5 font-bold text-slate-700 whitespace-nowrap">
                  <TrendingUp size={14} className="text-blue-500 shrink-0" />
                  <span>
                    {completedTasksCount} / {project.tasks.length}
                  </span>
                </div>

                <div className="flex -space-x-1.5 overflow-hidden">
                  {project.team.slice(0, 3).map((member) => (
                    <UserAvatar
                      key={member.id}
                      name={member.name}
                      avatar={member.avatar}
                      size="xs"
                      className="ring-2 ring-white"
                    />
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-6 h-6 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[9px] font-bold text-slate-600">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>

                <span className="p-1 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors hidden md:inline-block">
                  <ArrowRight size={16} />
                </span>
              </div>
            </div>
          );
        })}

        {projects.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm font-medium">
            Aucun projet trouvé
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
