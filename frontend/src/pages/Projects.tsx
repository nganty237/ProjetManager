import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { ProjectCard } from '@/components/Projects/ProjectCard';
import { ProjectList } from '@/components/Projects/ProjectList';
import { ProjectKanban } from '@/components/Projects/ProjectKanban';
import { ProjectFilters } from '@/components/Projects/ProjectFilters';
import { ProjectForm } from '@/components/Projects/ProjectForm';
import { ViewMode } from '@/types';
import { Plus } from 'lucide-react';

/**
 * Main project management page offering grid, list, and kanban view layouts.
 */
export function Projects() {
  const { viewMode, setViewMode, getFilteredProjects } = useProjectStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Administrateur';
  const [showForm, setShowForm] = useState(false);
  const projects = getFilteredProjects();

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestion des Projets
            </h1>
            <span className="badge bg-slate-100 text-slate-700 text-xs rounded">
              {projects.length}
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Gérez, suivez et collaborez sur tous vos projets en cours
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold rounded-md"
          >
            <Plus size={18} />
            <span>Nouveau Projet</span>
          </button>
        )}
      </div>

      <ProjectFilters
        viewMode={viewMode}
        onViewModeChange={(mode: ViewMode) => setViewMode(mode)}
      />

      <div className="min-w-0">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {projects.length === 0 && (
              <div className="col-span-full bg-white rounded-md border border-slate-200 p-12 text-center text-slate-400 font-medium">
                Aucun projet ne correspond à vos critères de recherche.
              </div>
            )}
          </div>
        )}

        {viewMode === 'list' && (
          <div>
            <div className="hidden sm:block">
              <ProjectList />
            </div>
            <div className="sm:hidden grid grid-cols-1 gap-4">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {viewMode === 'kanban' && <ProjectKanban />}
      </div>

      {showForm && <ProjectForm onClose={() => setShowForm(false)} />}
    </div>
  );
}

export default Projects;
