import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { Mail, Briefcase } from 'lucide-react';

const Team: React.FC = () => {
  const { teamMembers, projects } = useProjectStore();
  
  // Calculer les statistiques pour chaque membre
  const membersWithStats = teamMembers.map((member) => {
    const memberProjects = projects.filter((p) =>
      p.team.some((m) => m.id === member.id)
    );
    const memberTasks = projects.flatMap((p) =>
      p.tasks.filter((t) => t.assignedTo?.id === member.id)
    );
    const completedTasks = memberTasks.filter((t) => t.status === 'done').length;
    
    return {
      ...member,
      projectCount: memberProjects.length,
      taskCount: memberTasks.length,
      completedTasks,
    };
  });
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Équipe</h1>
        <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
          {teamMembers.length} membre{teamMembers.length > 1 ? 's' : ''} dans l'équipe
        </p>
      </div>
      
      {/* Grille des membres */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {membersWithStats.map((member) => (
          <div key={member.id} className="card">
            {/* Avatar et info */}
            <div className="flex items-start gap-4 mb-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{member.name}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Briefcase size={14} className="flex-shrink-0" />
                  <span className="truncate">{member.role}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <Mail size={14} className="flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
              </div>
            </div>
            
            {/* Statistiques */}
            <div className="pt-4 border-t border-gray-200">
              <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-primary-600">
                    {member.projectCount}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-wider">Projets</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">
                    {member.taskCount}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-wider">Tâches</div>
                </div>
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">
                    {member.completedTasks}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-600 uppercase tracking-wider">Terminées</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;
