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
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Projets Actifs',
      value: stats.active,
      icon: TrendingUp,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Projets Terminés',
      value: stats.completed,
      icon: CheckCircle2,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'En Pause',
      value: stats.onHold,
      icon: PauseCircle,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
    },
    {
      title: 'Tâches',
      value: `${stats.completedTasks} / ${stats.totalTasks}`,
      icon: ListTodo,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50',
      subtitle: 'Terminées',
    },
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.title} className="card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                {card.subtitle && (
                  <p className="text-xs text-gray-500 mt-1">{card.subtitle}</p>
                )}
              </div>
              <div className={`${card.bgColor} p-3 rounded-lg`}>
                <Icon className={`${card.color} text-white`} size={24} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
