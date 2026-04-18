import React, { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import ProjectCard from '@/components/Projects/ProjectCard';
import ProjectList from '@/components/Projects/ProjectList';
import ProjectKanban from '@/components/Projects/ProjectKanban';
import ProjectFilters from '@/components/Projects/ProjectFilters';
import ProjectForm from '@/components/Projects/ProjectForm';
import { ViewMode } from '@/types';
import { PlusCircle } from 'lucide-react';

const Projects: React.FC = () => {
  const { viewMode, setViewMode, getFilteredProjects } = useProjectStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Administrateur';
  const [showForm, setShowForm] = useState(false);
  const projects = getFilteredProjects();
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Projets</h1>
          <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
            {projects.length} projet{projects.length > 1 ? 's' : ''} trouvé{projects.length > 1 ? 's' : ''}
          </p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <PlusCircle size={20} />
            Nouveau Projet
          </button>
        )}
      </div>
      
      {/* Filtres */}
      <ProjectFilters
        viewMode={viewMode}
        onViewModeChange={(mode: ViewMode) => setViewMode(mode)}
      />
      
      {/* Vue des projets */}
      <div className="min-w-0 overflow-x-auto sm:overflow-x-visible pb-4">
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
            {projects.length === 0 && (
              <div className="col-span-full card text-center text-gray-500 py-12">
                Aucun projet trouvé
              </div>
            )}
          </div>
        )}
        
        {viewMode === 'list' && (
          <div className="hidden sm:block">
            <ProjectList />
          </div>
        )}
        {viewMode === 'list' && (
          <div className="sm:hidden grid grid-cols-1 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
        
        {viewMode === 'kanban' && <ProjectKanban />}
      </div>
      
      {/* Modal du formulaire */}
      {showForm && (
        <ProjectForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default Projects;
