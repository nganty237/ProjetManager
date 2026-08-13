import { useProjectStore } from '@/store/projectStore';
import ProjectCard from './ProjectCard';

export function ProjectKanban() {
  const projects = useProjectStore((state) => state.getFilteredProjects());

  const columns = [
    { id: 'planning', title: 'Planification', dotBg: 'bg-blue-500', headerBg: 'bg-blue-50/80 border-blue-100 text-blue-900' },
    { id: 'active', title: 'En cours', dotBg: 'bg-emerald-500', headerBg: 'bg-emerald-50/80 border-emerald-100 text-emerald-900' },
    { id: 'on-hold', title: 'En pause', dotBg: 'bg-amber-500', headerBg: 'bg-amber-50/80 border-amber-100 text-amber-900' },
    { id: 'completed', title: 'Terminé', dotBg: 'bg-indigo-500', headerBg: 'bg-indigo-50/80 border-indigo-100 text-indigo-900' },
  ];

  return (
    <div className="flex gap-5 overflow-x-auto pb-6 pt-1 min-h-[500px]">
      {columns.map((column) => {
        const columnProjects = projects.filter((p) => p.status === column.id);

        return (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 sm:w-84 bg-slate-100/60 rounded-2xl border border-slate-200/70 p-3 flex flex-col"
          >
            {/* Header de colonne */}
            <div className={`flex items-center justify-between p-3 rounded-xl border mb-3 ${column.headerBg}`}>
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${column.dotBg}`} />
                <h3 className="font-extrabold text-xs uppercase tracking-wider">
                  {column.title}
                </h3>
              </div>
              <span className="w-5 h-5 rounded-full bg-white/90 font-bold text-xs flex items-center justify-center shadow-2xs">
                {columnProjects.length}
              </span>
            </div>

            {/* Cartes de projets */}
            <div className="space-y-3 flex-1 overflow-y-auto">
              {columnProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {columnProjects.length === 0 && (
                <div className="h-32 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-xs font-semibold">
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
