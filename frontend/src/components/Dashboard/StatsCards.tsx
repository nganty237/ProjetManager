import { useProjectStore } from '@/store/projectStore';
import { useAuthStore } from '@/store/authStore';
import { getPortfolioFinancials } from '@/utils/budgetUtils';
import { formatFCFACompact } from '@/utils/budgetConstants';
import { TrendingUp, FolderKanban, CheckCircle2, Wallet, CreditCard, ListTodo, CheckSquare } from 'lucide-react';

/**
 * Metric KPI card component displaying project overview counters.
 */
export function StatsCards() {
  const user = useAuthStore((state) => state.user);
  const isMember = user?.role === 'MEMBRE';
  const stats = useProjectStore((state) => state.getProjectStats());
  const projects = useProjectStore((state) => state.projects);
  const fin = getPortfolioFinancials(projects);

  const memberTasks = projects.flatMap((p) => 
    p.tasks.filter((t) => t.assignedTo?.id === user?.id || t.assignedToId === user?.id)
  );
  const memberCompletedTasks = memberTasks.filter((t) => t.status === 'done').length;
  
  const cards = isMember ? [
    {
      title: 'Mes Projets',
      value: projects.length,
      icon: FolderKanban,
      iconStyle: 'bg-[#2563EB] text-white',
      subtitle: `${stats.active} en cours`,
    },
    {
      title: 'Projets Actifs',
      value: stats.active,
      icon: TrendingUp,
      iconStyle: 'bg-[#2563EB] text-white',
    },
    {
      title: 'Projets Terminés',
      value: stats.completed,
      icon: CheckCircle2,
      iconStyle: 'bg-[#16A34A] text-white',
    },
    {
      title: 'Mes Tâches Assignées',
      value: memberTasks.length,
      icon: ListTodo,
      iconStyle: 'bg-[#D97706] text-white',
      subtitle: `${memberTasks.length - memberCompletedTasks} restantes`,
    },
    {
      title: 'Mes Tâches Terminées',
      value: memberCompletedTasks,
      icon: CheckSquare,
      iconStyle: 'bg-[#16A34A] text-white',
      subtitle: memberTasks.length > 0 ? `${Math.round((memberCompletedTasks / memberTasks.length) * 100)}% de complétion` : 'Aucune tâche',
    },
  ] : [
    {
      title: 'Total Projets',
      value: stats.total,
      icon: FolderKanban,
      iconStyle: 'bg-[#2563EB] text-white',
    },
    {
      title: 'Projets Actifs',
      value: stats.active,
      icon: TrendingUp,
      iconStyle: 'bg-[#2563EB] text-white',
    },
    {
      title: 'Projets Terminés',
      value: stats.completed,
      icon: CheckCircle2,
      iconStyle: 'bg-[#16A34A] text-white',
    },
    {
      title: 'Budget Total',
      value: fin.totalAllocated > 0 ? formatFCFACompact(fin.totalAllocated) : '0 FCFA',
      icon: Wallet,
      iconStyle: 'bg-[#D97706] text-white',
      subtitle: `${fin.projectsWithBudget} projet${fin.projectsWithBudget > 1 ? 's' : ''} budgétisé${fin.projectsWithBudget > 1 ? 's' : ''}`,
    },
    {
      title: 'Total Dépensé',
      value: fin.totalSpent > 0 ? formatFCFACompact(fin.totalSpent) : '0 FCFA',
      icon: CreditCard,
      iconStyle: 'bg-[#6366F1] text-white',
      subtitle: fin.totalAllocated > 0 ? `${fin.consumptionRate.toFixed(1)}% consommé` : 'Aucun budget défini',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white border border-slate-200 rounded-md p-5 flex flex-col justify-between min-h-[120px]"
          >
            <div className="flex items-start justify-between w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div className={`p-2 rounded-md shrink-0 ${card.iconStyle}`}>
                <Icon size={18} />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.value}
              </p>
              {card.subtitle && (
                <p className="text-xs font-medium text-slate-500 mt-1">{card.subtitle}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default StatsCards;

