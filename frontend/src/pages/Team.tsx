import { useState } from 'react';
import { useProjectStore } from '@/store/projectStore';
import { Mail, Shield, FolderKanban, CheckCircle2, ListTodo, Crown, UserCheck } from 'lucide-react';
import { UserAvatar } from '@/components/Common/UserAvatar';

/**
 * Component for managing and displaying team members categorized by roles (Administrators and Members).
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
    <div className="space-y-6 sm:space-y-8">
      {/* En-tête de la page Équipe */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Gestion de l'Équipe
            </h1>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full border border-slate-200">
              {teamMembers.length} membres
            </span>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Visualisez et gérez les membres et administrateurs du projet
          </p>
        </div>

        {/* Barre de filtres par rôles */}
        <div className="flex items-center bg-slate-100/80 p-1 rounded-xl border border-slate-200/60 self-start sm:self-auto">
          <button
            onClick={() => setRoleFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'all'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tous ({teamMembers.length})
          </button>
          <button
            onClick={() => setRoleFilter('admin')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'admin'
                ? 'bg-white text-amber-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Administrateurs ({admins.length})
          </button>
          <button
            onClick={() => setRoleFilter('member')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              roleFilter === 'member'
                ? 'bg-white text-blue-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Membres ({members.length})
          </button>
        </div>
      </div>

      {/* Section 1 : Rubrique Administrateurs */}
      {(roleFilter === 'all' || roleFilter === 'admin') && (
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
            <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg border border-amber-200/60">
              <Crown size={18} />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Administrateurs
            </h2>
            <span className="text-xs font-bold bg-amber-100/70 text-amber-800 px-2 py-0.5 rounded-full">
              {admins.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
            {admins.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 text-sm font-medium">
                Aucun administrateur trouvé.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Section 2 : Rubrique Membres */}
      {(roleFilter === 'all' || roleFilter === 'member') && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-200/80">
            <div className="p-1.5 bg-blue-50 text-blue-600 rounded-lg border border-blue-200/60">
              <UserCheck size={18} />
            </div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Membres de l'Équipe
            </h2>
            <span className="text-xs font-bold bg-blue-100/70 text-blue-800 px-2 py-0.5 rounded-full">
              {members.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
            {members.length === 0 && (
              <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 p-8 text-center text-slate-400 text-sm font-medium">
                Aucun membre trouvé.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Sub-component for rendering an individual team member card with avatar, role badge, and stats.
 */
function TeamMemberCard({ member }: { member: any }) {
  const isAdmin = member.isAdmin;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-lg hover:border-blue-200/90 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start gap-3.5 mb-4">
          <UserAvatar name={member.name} avatar={member.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate mb-1">
              {member.name}
            </h3>
            <div className="flex items-center gap-1.5 mb-2">
              <Shield size={13} className={isAdmin ? 'text-amber-500' : 'text-blue-500'} />
              <span
                className={`inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                  isAdmin
                    ? 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    : 'bg-blue-50 text-blue-700 border border-blue-200/60'
                }`}
              >
                {member.role}
              </span>
            </div>
            <a
              href={`mailto:${member.email}`}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors truncate"
              title="Envoyer un email"
            >
              <Mail size={13} className="shrink-0 text-slate-400" />
              <span className="truncate">{member.email}</span>
            </a>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100">
        <div className="grid grid-cols-3 gap-2 bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 text-center">
          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-blue-600 font-extrabold text-base">
              <FolderKanban size={14} />
              {member.projectCount}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Projets</div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-indigo-600 font-extrabold text-base">
              <ListTodo size={14} />
              {member.taskCount}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tâches</div>
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-emerald-600 font-extrabold text-base">
              <CheckCircle2 size={14} />
              {member.completedTasks}
            </div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Fini</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Team;
