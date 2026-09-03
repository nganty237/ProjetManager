import { useProjectStore } from '@/store/projectStore';
import { useNavigate } from 'react-router-dom';
import { statusConfig, priorityConfig, formatDate } from '@/utils/constants';
import { ArrowRight } from 'lucide-react';
import { UserAvatar } from '@/components/Common/UserAvatar';

/**
 * List component for displaying projects in a structured grid layout with aligned columns.
 */
export function ProjectList() {
  const { getFilteredProjects } = useProjectStore();
  const projects = getFilteredProjects();
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
      {/* Header line with column specifications */}
      <div className="grid grid-cols-12 gap-4 items-center px-4 py-3 bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider select-none">
        <div className="col-span-4">PROJET</div>
        <div className="col-span-2">STATUT</div>
        <div className="col-span-2">PRIORITÉ</div>
        <div className="col-span-2">ÉCHÉANCE</div>
        <div className="col-span-1">ÉQUIPE</div>
        <div className="col-span-1 text-right">ACTION</div>
      </div>

      {/* Project rows aligning with header */}
      <div className="divide-y divide-slate-100">
        {projects.map((project) => {
          const status = statusConfig[project.status];
          const priority = priorityConfig[project.priority];
          const completedTasksCount = project.tasks.filter((t) => t.status === 'done').length;

          return (
            <div
              key={project.id}
              onClick={() => navigate(`/projects/${project.id}`)}
              className="grid grid-cols-12 gap-4 items-center px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer group text-xs text-slate-700"
            >
              {/* PROJET */}
              <div className="col-span-4 min-w-0 pr-2">
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                  {project.title}
                </h3>
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                  <span className="truncate">{project.description || 'Aucune description'}</span>
                  <span className="text-slate-300">•</span>
                  <span className="font-semibold text-slate-600 shrink-0">
                    {completedTasksCount}/{project.tasks.length} tâches
                  </span>
                </div>
              </div>

              {/* STATUT */}
              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 font-semibold ${status.color}`}>
                  {status.icon} {status.label}
                </span>
              </div>

              {/* PRIORITÉ */}
              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 font-semibold ${priority.color}`}>
                  {priority.label}
                </span>
              </div>

              {/* ÉCHÉANCE */}
              <div className="col-span-2 font-medium text-slate-600 whitespace-nowrap">
                {project.endDate ? formatDate(project.endDate) : '-'}
              </div>

              {/* ÉQUIPE */}
              <div className="col-span-1">
                <div className="flex -space-x-1.5 overflow-hidden">
                  {project.team.slice(0, 3).map((member) => (
                    <UserAvatar
                      key={member.id}
                      name={member.name}
                      avatar={member.avatar}
                      size="xs"
                      className="border border-white"
                    />
                  ))}
                  {project.team.length > 3 && (
                    <div className="w-6 h-6 bg-slate-100 border border-white flex items-center justify-center text-[9px] font-bold text-slate-600 rounded">
                      +{project.team.length - 3}
                    </div>
                  )}
                </div>
              </div>

              {/* ACTION */}
              <div className="col-span-1 text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/projects/${project.id}`);
                  }}
                  className="p-1.5 text-slate-400 group-hover:text-blue-600 hover:bg-slate-100 transition-colors inline-flex items-center justify-center rounded"
                  title="Voir le projet"
                >
                  <ArrowRight size={16} />
                </button>
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
