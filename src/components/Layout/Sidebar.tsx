import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  PlusCircle,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onCreateProject }) => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/projects', icon: FolderKanban, label: 'Projets' },
    { path: '/team', icon: Users, label: 'Équipe' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ];
  
  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      {/* Logo & Close Button (Mobile) */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary-600 flex items-center gap-2">
          <FolderKanban size={28} />
          PROJET MANAGER
        </h1>
        <button 
          onClick={onClose}
          className="p-1 lg:hidden text-gray-500 hover:bg-gray-100 rounded"
        >
          <X size={20} />
        </button>
      </div>
      
      {/* Bouton Nouveau Projet */}
      <div className="p-4">
        <button
          onClick={onCreateProject}
          className="btn btn-primary w-full flex items-center justify-center gap-2"
        >
          <PlusCircle size={20} />
          Nouveau Projet
        </button>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          © 2024 PROJET MANAGER
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
