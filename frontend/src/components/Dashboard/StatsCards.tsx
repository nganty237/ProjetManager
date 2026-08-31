import { useProjectStore } from '@/store/projectStore';
import { TrendingUp, FolderKanban, CheckCircle2, PauseCircle, ListTodo } from 'lucide-react';

/**
 * Metric KPI card component displaying project overview counters.
 */
export function StatsCards() {
  const stats = useProjectStore((state) => state.getProjectStats());
  
  const cards = [
    {
      title: 'Total Projets',
      value: stats.total,
      icon: FolderKanban,
      iconBg: 'bg-blue-600 text-white',
    },
    {
      title: 'Projets Actifs',
      value: stats.active,
      icon: TrendingUp,
      iconBg: 'bg-emerald-600 text-white',
    },
    {
      title: 'Projets Terminés',
      value: stats.completed,
      icon: CheckCircle2,
      iconBg: 'bg-indigo-600 text-white',
    },
    {
      title: 'En Pause',
      value: stats.onHold,
      icon: PauseCircle,
      iconBg: 'bg-amber-600 text-white',
    },
    {
      title: 'Tâches',
      value: `${stats.completedTasks} / ${stats.totalTasks}`,
      icon: ListTodo,
      iconBg: 'bg-slate-700 text-white',
      subtitle: 'Tâches terminées',
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
              <div className={`p-2 rounded ${card.iconBg}`}>
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
