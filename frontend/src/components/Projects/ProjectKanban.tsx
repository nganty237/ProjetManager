import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import ProjectCard from './ProjectCard';

const ProjectKanban: React.FC = () => {
  const projects = useProjectStore((state) => state.getFilteredProjects());
  
  const columns = [
    { id: 'planning', title: 'Planification', color: 'bg-blue-100' },
    { id: 'active', title: 'En cours', color: 'bg-green-100' },
    { id: 'on-hold', title: 'En pause', color: 'bg-yellow-100' },
    { id: 'completed', title: 'Terminé', color: 'bg-purple-100' },
  ];
  
  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {columns.map((column) => {
        const columnProjects = projects.filter((p) => p.status === column.id);
        
        return (
          <div key={column.id} className="flex-shrink-0 w-80">
            <div className={`${column.color} rounded-t-lg px-4 py-3 mb-2`}>
              <h3 className="font-semibold text-gray-900 flex items-center justify-between">
                <span>{column.title}</span>
                <span className="px-2 py-1 bg-white rounded-full text-sm">
                  {columnProjects.length}
                </span>
              </h3>
            </div>
            <div className="space-y-3">
              {columnProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
              {columnProjects.length === 0 && (
                <div className="card text-center text-gray-500 py-8">
                  Aucun projet
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectKanban;
