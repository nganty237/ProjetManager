import React from 'react';
import StatsCards from '@/components/Dashboard/StatsCards';
import { useProjectStore } from '@/store/projectStore';
import ProjectCard from '@/components/Projects/ProjectCard';
import { TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { isOverdue } from '@/utils/constants';

const Dashboard: React.FC = () => {
  const projects = useProjectStore((state) => state.projects);
  
  // Projets actifs
  const activeProjects = projects
    .filter((p) => p.status === 'active')
    .slice(0, 3);
  
  // Projets récents
  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);
  
  // Projets en retard
  const overdueProjects = projects.filter((p) => isOverdue(p.endDate, p.status));
  
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Titre */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Tableau de bord</h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">Vue d'ensemble de vos projets</p>
      </div>
      
      {/* Statistiques */}
      <StatsCards />
      
      {/* Grille de sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Projets actifs */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="text-green-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Projets actifs</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {activeProjects.length > 0 ? (
              activeProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="card text-center text-gray-500 py-12">
                Aucun projet actif
              </div>
            )}
          </div>
        </div>
        
        {/* Projets récents */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="text-blue-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">Récemment mis à jour</h2>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {recentProjects.length > 0 ? (
              recentProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))
            ) : (
              <div className="card text-center text-gray-500 py-12">
                Aucun projet récent
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Alertes - Projets en retard */}
      {overdueProjects.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-600" size={24} />
            <h2 className="text-xl font-bold text-gray-900">
              Projets en retard ({overdueProjects.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {overdueProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
