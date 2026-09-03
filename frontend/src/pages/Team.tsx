import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { Mail, Crown, Users } from 'lucide-react';
import { UserAvatar } from '@/components/Common/UserAvatar';

/**
 * Page Équipe : design épuré, sobre et professionnel.
 */
export function Team() {
  const { teamMembers, projects } = useProjectStore();
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'member'>('all');

  const membersWithStats = teamMembers.map((member) => {
    const memberProjects = projects.filter((p) =>
      p.team.some((m) => m.id === member.id)
    );
    const memberTasks = projects.flatMap((p) =>
      p.tasks.filter((t) => t.assignedTo?.id === member.id || t.assignedToId === member.id)
    );
    const completedTasks = memberTasks.filter((t) => t.status === 'done').length;

    return {
      ...member,
      projectCount: memberProjects.length,
      taskCount: memberTasks.length,
      completedTasks,
      isAdmin: member.role === 'Administrateur' || member.role === 'Admin',
    };
  });

  const admins = membersWithStats.filter((m) => m.isAdmin);
  const members = membersWithStats.filter((m) => !m.isAdmin);

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

        {/* Filtres d'onglets sobres */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg self-start sm:self-auto text-xs font-medium">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tous ({teamMembers.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              roleFilter === 'admin'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Administrateurs ({admins.length})
          </button>
          <button
            onClick={() => setRoleFilter('member')}
            className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
              roleFilter === 'member'
                ? 'bg-white text-slate-900 shadow-sm'
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
  const isAdmin = member.isAdmin;

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
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                isAdmin
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-slate-50 text-slate-600 border-slate-200'
              }`}
            >
              {isAdmin ? 'Admin' : 'Membre'}
            </span>
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
