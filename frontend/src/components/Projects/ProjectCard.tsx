import { Project } from '@/types';
import { statusConfig, priorityConfig, formatDate, getDaysRemaining, isOverdue } from '@/utils/constants';
import { Calendar, TrendingUp, Users, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserAvatar } from '@/components/Common/UserAvatar';

interface ProjectCardProps {
  project: Project;
}

/**
 * Reusable card component for displaying individual project details in grid views.
 */
export function ProjectCard({ project }: ProjectCardProps) {
  const navigate = useNavigate();

  const status = statusConfig[project.status];
  const priority = priorityConfig[project.priority];
  const daysRemaining = project.endDate ? getDaysRemaining(project.endDate) : null;
  const overdue = isOverdue(project.endDate, project.status);
  const completedTasksCount = project.tasks.filter((t) => t.status === 'done').length;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg hover:border-blue-200/90 transition-all duration-300 cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-2.5">
          <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
            {project.title}
          </h3>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4 min-h-[32px]">
          {project.description || 'Aucune description fournie.'}
        </p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`badge ${status.bgColor} ${status.color} text-[11px] font-bold flex items-center gap-1.5`}>
            {status.icon} {status.label}
          </span>
          <span className={`badge ${priority.bgColor} ${priority.color} text-[11px] font-bold`}>
            {priority.label}
          </span>
        </div>

        <div className="space-y-2 pt-3 border-t border-slate-100 text-xs">
          {project.endDate && (
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar size={14} className="text-slate-400 shrink-0" />
                {formatDate(project.endDate)}
              </span>

              {overdue ? (
                <span className="text-rose-600 font-bold flex items-center gap-1 bg-rose-50 px-2 py-0.5 rounded-md text-[11px]">
                  <AlertCircle size={13} />
                  Retard: {Math.abs(daysRemaining || 0)} j
                </span>
              ) : daysRemaining !== null ? (
                <span className="text-slate-500 font-medium bg-slate-50 px-2 py-0.5 rounded-md text-[11px]">
                  {daysRemaining} j restants
                </span>
              ) : null}
            </div>
          )}

          <div className="flex items-center gap-2 text-slate-500 font-medium pt-1">
            <TrendingUp size={14} className="text-blue-500 shrink-0" />
            <span className="text-slate-700 font-bold">
              {completedTasksCount} / {project.tasks.length} tâches
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <Users size={14} className="text-slate-400 shrink-0" />
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
        </div>

        <span className="p-1.5 rounded-lg text-slate-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
          <ArrowRight size={16} />
        </span>
      </div>
    </div>
  );
}

export default ProjectCard;
