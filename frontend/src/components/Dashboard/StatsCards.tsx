import { useProjectStore } from '@/store/projectStore';
import { TrendingUp, FolderKanban, CheckCircle2, PauseCircle, ListTodo } from 'lucide-react';

export function StatsCards() {
  const stats = useProjectStore((state) => state.getProjectStats());
  
  const cards = [
    {
      title: 'Total Projets',
      value: stats.total,
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50 border border-blue-100',
      iconBg: 'bg-blue-600 text-white shadow-xs shadow-blue-500/20',
    },
    {
      title: 'Projets Actifs',
      value: stats.active,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50/60 border border-emerald-100',
      iconBg: 'bg-emerald-600 text-white shadow-xs shadow-emerald-500/20',
    },
    {
      title: 'Projets Terminés',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50/60 border border-indigo-100',
      iconBg: 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20',
    },
    {
      title: 'En Pause',
      value: stats.onHold,
      icon: PauseCircle,
      color: 'text-amber-600',
      bgColor: 'bg-amber-50/60 border border-amber-100',
      iconBg: 'bg-amber-500 text-white shadow-xs shadow-amber-500/20',
    },
    {
      title: 'Tâches',
      value: `${stats.completedTasks} / ${stats.totalTasks}`,
      icon: ListTodo,
      color: 'text-sky-600',
      bgColor: 'bg-sky-50/60 border border-sky-100',
      iconBg: 'bg-sky-600 text-white shadow-xs shadow-sky-500/20',
      subtitle: 'Tâches terminées',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-300 min-h-[120px]"
          >
            <div className="flex items-start justify-between w-full">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {card.title}
              </span>
              <div className={`p-2.5 rounded-xl ${card.iconBg}`}>
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
};

export default StatsCards;
