import { useProjectStore } from '@/store/projectStore';
import { StatsCards } from '@/components/Dashboard/StatsCards';

import { UserAvatar } from '@/components/Common/UserAvatar';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  AlertCircle,
  Clock,
  FolderKanban,
  ArrowRight,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { priorityConfig, statusConfig, formatDate, isOverdue, getDaysRemaining } from '@/utils/constants';

/**
 * Main executive Dashboard page displaying business KPIs, recent projects, priority tasks, and portfolio status.
 */
export function Dashboard() {
  const navigate = useNavigate();
  const { projects } = useProjectStore();

  const recentProjects = [...projects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const overdueProjects = projects.filter((p) => isOverdue(p.endDate, p.status));

  const urgentTasks = projects
    .flatMap((p) => p.tasks.map((t) => ({ ...t, projectName: p.title, projectId: p.id })))
    .filter((t) => t.status !== 'done')
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
      return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
    })
    .slice(0, 5);

  const totalProjectsCount = projects.length || 1;
  const planningCount = projects.filter((p) => p.status === 'planning').length;
  const activeCount = projects.filter((p) => p.status === 'active').length;
  const onHoldCount = projects.filter((p) => p.status === 'on-hold').length;
  const completedCount = projects.filter((p) => p.status === 'completed').length;
  const cancelledCount = projects.filter((p) => p.status === 'cancelled').length;

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Tableau de Bord
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm mt-1">
            Vue d'ensemble en temps réel de vos projets et de votre équipe
          </p>
        </div>
        <button
          onClick={() => navigate('/projects')}
          className="btn btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-semibold rounded-md"
        >
          <FolderKanban size={16} />
          <span>Voir tous les projets</span>
          <ArrowRight size={14} />
        </button>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Aperçu des projets récents */}
          <div className="bg-white border border-slate-200 rounded-md overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#2563EB] text-white rounded-md shrink-0">
                  <Layers size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Aperçu des Projets Récents</h3>
                  <p className="text-xs text-slate-500">Derniers projets mis à jour</p>
                </div>
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Tout voir ({projects.length})
                <ChevronRight size={14} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="py-3 px-4">Projet</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4">Priorité</th>
                    <th className="py-3 px-4">Échéance</th>
                    <th className="py-3 px-4">Équipe</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {recentProjects.length > 0 ? (
                    recentProjects.map((project) => {
                      const status = statusConfig[project.status];
                      const priority = priorityConfig[project.priority];
                      const completedTasks = project.tasks.filter((t) => t.status === 'done').length;
                      return (
                        <tr
                          key={project.id}
                          className="hover:bg-slate-50 transition-colors group cursor-pointer"
                          onClick={() => navigate(`/projects/${project.id}`)}
                        >
                          <td className="py-3.5 px-4 font-bold text-slate-900 max-w-[180px] truncate">
                            <div className="flex flex-col">
                              <span className="group-hover:text-blue-600 transition-colors truncate">
                                {project.title}
                              </span>
                              <span className="text-[11px] font-normal text-slate-400 truncate">
                                {completedTasks} / {project.tasks.length} tâches
                              </span>
                            </div>
                          </td>
                          <td className="py-3.5 px-4 font-semibold">
                            <span className={status.color}>
                              {status.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold">
                            <span className={priority.color}>
                              {priority.label}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium whitespace-nowrap">
                            {project.endDate ? formatDate(project.endDate) : '-'}
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex -space-x-1.5 overflow-hidden">
                              {project.team.slice(0, 3).map((member) => (
                                <UserAvatar
                                  key={member.id}
                                  name={member.name}
                                  avatar={member.avatar}
                                  size="xs"
                                  className="border border-white"
                                />
                              ))}
                              {project.team.length > 3 && (
                                <div className="w-6 h-6 bg-slate-100 border border-white rounded flex items-center justify-center text-[9px] font-bold text-slate-600">
                                  +{project.team.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => navigate(`/projects/${project.id}`)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                              title="Voir les détails"
                            >
                              <ArrowRight size={16} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                        Aucun projet disponible
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Tâches prioritaires en cours */}
          <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#D97706] text-white rounded-md shrink-0">
                  <Clock size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Tâches Prioritaires En Cours</h3>
                  <p className="text-xs text-slate-500">Tâches nécessitant une attention immédiate</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              {urgentTasks.length > 0 ? (
                urgentTasks.map((task) => {
                  const priority = priorityConfig[task.priority];
                  return (
                    <div
                      key={task.id}
                      onClick={() => navigate(`/projects/${task.projectId}`)}
                      className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50 hover:bg-white transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                            {task.title}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            Projet : <span className="font-medium text-slate-600">{task.projectName}</span>
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`text-xs font-semibold ${priority.color} hidden xs:inline-block`}>
                          {priority.label}
                        </span>
                        {task.assignedTo ? (
                          <UserAvatar name={task.assignedTo.name} avatar={task.assignedTo.avatar} size="xs" />
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Non assignée</span>
                        )}
                        <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors" />
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs font-medium">
                  Toutes les tâches prioritaires sont terminées !
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6 sm:space-y-8">
          {/* Attention : Projets en retard */}
          {overdueProjects.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5">
              <div className="flex items-center gap-2.5 mb-3">
                <div className="p-2 bg-[#DC2626] text-white rounded-md shrink-0">
                  <AlertCircle size={18} />
                </div>
                <div>
                  <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-900">
                    Projets en Retard ({overdueProjects.length})
                  </h3>
                  <p className="text-[11px] text-rose-600 font-semibold">Nécessite une action immédiate</p>
                </div>
              </div>
              <div className="space-y-2">
                {overdueProjects.map((proj) => {
                  const days = proj.endDate ? Math.abs(getDaysRemaining(proj.endDate)) : 0;
                  return (
                    <div
                      key={proj.id}
                      onClick={() => navigate(`/projects/${proj.id}`)}
                      className="bg-slate-50 hover:bg-slate-100 p-3 border border-slate-200 rounded-md transition-colors cursor-pointer flex items-center justify-between group"
                    >
                      <div className="min-w-0 pr-2">
                        <p className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{proj.title}</p>
                        <p className="text-[11px] text-rose-600 font-semibold mt-0.5">
                          En retard de {days} jours
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-blue-600 transition-colors shrink-0" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Répartition des statuts */}
          <div className="bg-white border border-slate-200 rounded-md p-4 sm:p-5">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="p-2 bg-[#6366F1] text-white rounded-md shrink-0">
                <TrendingUp size={18} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Répartition des Statuts</h3>
                <p className="text-xs text-slate-500">Santé globale du portefeuille</p>
              </div>
            </div>

            <div className="space-y-3 text-xs font-medium">
              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#6366F1]" />
                    Planification
                  </span>
                  <span className="font-bold">{planningCount} ({Math.round((planningCount / totalProjectsCount) * 100)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                  <div className="h-full bg-[#6366F1] rounded-sm" style={{ width: `${(planningCount / totalProjectsCount) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                    En cours
                  </span>
                  <span className="font-bold">{activeCount} ({Math.round((activeCount / totalProjectsCount) * 100)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                  <div className="h-full bg-[#2563EB] rounded-sm" style={{ width: `${(activeCount / totalProjectsCount) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                    En pause
                  </span>
                  <span className="font-bold">{onHoldCount} ({Math.round((onHoldCount / totalProjectsCount) * 100)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                  <div className="h-full bg-[#D97706] rounded-sm" style={{ width: `${(onHoldCount / totalProjectsCount) * 100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-700 mb-1">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                    Terminés
                  </span>
                  <span className="font-bold">{completedCount} ({Math.round((completedCount / totalProjectsCount) * 100)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                  <div className="h-full bg-[#16A34A] rounded-sm" style={{ width: `${(completedCount / totalProjectsCount) * 100}%` }} />
                </div>
              </div>

              {cancelledCount > 0 && (
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#DC2626]" />
                      Annulés
                    </span>
                    <span className="font-bold">{cancelledCount} ({Math.round((cancelledCount / totalProjectsCount) * 100)}%)</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 rounded-sm overflow-hidden">
                    <div className="h-full bg-[#DC2626] rounded-sm" style={{ width: `${(cancelledCount / totalProjectsCount) * 100}%` }} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
