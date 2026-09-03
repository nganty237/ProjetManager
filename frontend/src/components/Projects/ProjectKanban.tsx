import { useProjectStore } from '@/store/projectStore';
import ProjectCard from './ProjectCard';

/**
 * Kanban board component displaying projects grouped into status columns with clean, neutral corporate layout.
 */
export function ProjectKanban() {
  const projects = useProjectStore((state) => state.getFilteredProjects());

  const columns = [
    { id: 'planning', title: 'Planification', dotBg: 'bg-[#6366F1]' },
    { id: 'active', title: 'En cours', dotBg: 'bg-[#2563EB]' },
    { id: 'on-hold', title: 'En pause', dotBg: 'bg-[#D97706]' },
    { id: 'completed', title: 'Terminé', dotBg: 'bg-[#16A34A]' },
    { id: 'cancelled', title: 'Annulé', dotBg: 'bg-[#DC2626]' },
  ];

  return (
    <div className="flex gap-5 overflow-x-auto pb-6 pt-1 min-h-[500px]">
      {columns.map((column) => {
        const columnProjects = projects.filter((p) => p.status === column.id);

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 sm:w-84 bg-slate-50 rounded-md border border-slate-200 p-3 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-2.5 rounded-md border border-slate-200 bg-white mb-3">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${column.dotBg}`} />
                <h3 className="font-extrabold text-xs text-slate-800 uppercase tracking-wider">
                  {column.title}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded bg-slate-100 font-bold text-xs text-slate-700 border border-slate-200">
                {columnProjects.length}
              </span>
            </div>

            {/* Cards container */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {columnProjects.length === 0 && (
                <div className="h-32 rounded-md border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold bg-white">
                  Aucun projet
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ProjectKanban;
