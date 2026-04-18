import React from 'react';
import { useProjectStore } from '@/store/projectStore';
import { TrendingUp, FolderKanban, CheckCircle2, PauseCircle, ListTodo } from 'lucide-react';

const StatsCards: React.FC = () => {
  const stats = useProjectStore((state) => state.getProjectStats());
  
  const cards = [
    {
      title: 'Total Projets',
      value: stats.total,
      icon: FolderKanban,
      color: 'text-blue-500',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Projets Actifs',
      value: stats.active,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Projets Terminés',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'text-purple-500',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'En Pause',
      value: stats.onHold,
      icon: PauseCircle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Tâches',
      value: `${stats.completedTasks} / ${stats.totalTasks}`,
      icon: ListTodo,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-100',
      subtitle: 'Terminées',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex flex-col justify-between min-h-[110px]">
            <div className="flex items-start justify-between w-full">
              <p className="text-sm font-medium text-gray-500">{card.title}</p>
              <div className={`${card.bgColor} p-2 rounded-lg`}>
                <Icon className={`${card.color}`} size={20} />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-3xl font-bold text-gray-900">{card.value}</p>
              {card.subtitle && (
                <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
