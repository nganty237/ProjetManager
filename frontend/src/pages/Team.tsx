import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { Mail, Crown, Users, FolderKanban } from 'lucide-react';
import { UserAvatar } from '@/components/Common/UserAvatar';

/**
 * Page Équipe : vue de l'annuaire d'équipe avec les 3 rôles.
 */
export function Team() {
  const { teamMembers, projects } = useProjectStore();
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'chef' | 'member'>('all');

  const membersWithStats = teamMembers.map((member) => {
    const memberProjects = projects.filter((p) =>
      p.team && p.team.some((m) => m.id === member.id)
    );
    const memberTasks = projects.flatMap((p) =>
      p.tasks ? p.tasks.filter((t) => t.assignedTo?.id === member.id || t.assignedToId === member.id) : []
    );
    const completedTasks = memberTasks.filter((t) => t.status === 'done').length;

    const role = member.role;
    return {
      ...member,
      projectCount: memberProjects.length,
      taskCount: memberTasks.length,
      completedTasks,
      isAdmin: role === 'ADMINISTRATEUR' || role === 'Administrateur',
      isChef: role === 'CHEF_DE_PROJET' || role === 'Chef de projet',
      isMember: role === 'MEMBRE' || role === 'Membre',
    };
  });

  const admins = membersWithStats.filter((m) => m.isAdmin);
  const chefs = membersWithStats.filter((m) => m.isChef);
  const members = membersWithStats.filter((m) => m.isMember);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Équipe
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {teamMembers.length} membre{teamMembers.length > 1 ? 's' : ''} au total dans l'organisation
          </p>
        </div>

        {/* Filtres d'onglets */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs font-medium overflow-x-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              roleFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tous ({teamMembers.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              roleFilter === 'admin'
                ? 'bg-white text-amber-800 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Administrateurs ({admins.length})
          </button>
          <button
            onClick={() => setRoleFilter('chef')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              roleFilter === 'chef'
                ? 'bg-white text-blue-800 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Chefs de projet ({chefs.length})
          </button>
          <button
            onClick={() => setRoleFilter('member')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer whitespace-nowrap ${
              roleFilter === 'member'
                ? 'bg-white text-slate-900 shadow-sm font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Membres ({members.length})
          </button>
        </div>
      </div>

      {/* Section Administrateurs */}
      {(roleFilter === 'all' || roleFilter === 'admin') && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-1">
            <Crown size={15} className="text-amber-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Administrateurs ({admins.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {admins.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
            {admins.length === 0 && (
              <div className="col-span-full bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400 text-xs">
                Aucun administrateur
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Chefs de Projet */}
      {(roleFilter === 'all' || roleFilter === 'chef') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-1">
            <FolderKanban size={15} className="text-blue-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Chefs de Projet ({chefs.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chefs.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
            {chefs.length === 0 && (
              <div className="col-span-full bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400 text-xs">
                Aucun chef de projet
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section Membres */}
      {(roleFilter === 'all' || roleFilter === 'member') && (
        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-2 pb-1">
            <Users size={15} className="text-slate-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Membres ({members.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
            {members.length === 0 && (
              <div className="col-span-full bg-white rounded-lg border border-slate-200 p-6 text-center text-slate-400 text-xs">
                Aucun membre
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Carte de membre épurée, neutre et lisible.
 */
function TeamMemberCard({ member }: { member: any }) {
  const getRoleBadge = () => {
    if (member.isAdmin) {
      return <span className="text-xs font-semibold text-slate-900">Admin</span>;
    }
    if (member.isChef) {
      return <span className="text-xs font-medium text-slate-700">Chef de projet</span>;
    }
    return <span className="text-xs font-normal text-slate-500">Membre</span>;
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition-colors flex flex-col justify-between space-y-4">
      {/* En-tête : Avatar, Nom, Rôle, Email */}
      <div className="flex items-start gap-3">
        <UserAvatar name={member.name} avatar={member.avatar} size="md" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-bold text-slate-900 truncate">
              {member.name}
            </h3>
            {getRoleBadge()}
          </div>

          <a
            href={`mailto:${member.email}`}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors truncate mt-1"
            title={member.email}
          >
            <Mail size={12} className="shrink-0" />
            <span className="truncate">{member.email}</span>
          </a>
        </div>
      </div>

      {/* Métriques d'activité sobres */}
      <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
        <div>
          <p className="text-sm font-bold text-slate-900">{member.projectCount}</p>
          <p className="text-[11px] text-slate-400 font-normal">projets</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{member.taskCount}</p>
          <p className="text-[11px] text-slate-400 font-normal">tâches</p>
        </div>
        <div>
          <p className="text-sm font-bold text-slate-900">{member.completedTasks}</p>
          <p className="text-[11px] text-slate-400 font-normal">terminées</p>
        </div>
      </div>
    </div>
  );
}

export default Team;
