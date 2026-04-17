import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Settings,
  PlusCircle,
  X,
  User,
  LogOut,
  Shield,
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onCreateProject }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/projects', icon: FolderKanban, label: 'Projets' },
    { path: '/team', icon: Users, label: 'Équipe' },
    { path: '/settings', icon: Settings, label: 'Paramètres' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

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
        <ul className="space-y-1">
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

      {/* Footer – Utilisateur connecté */}
      <div className="p-4 border-t border-gray-200">
        <Link
          to="/profile"
          onClick={() => onClose()}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all mb-2 ${
            location.pathname === '/profile'
              ? 'bg-primary-50 text-primary-700'
              : 'hover:bg-gray-50'
          }`}
        >
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-9 h-9 object-cover" />
            ) : (
              getInitials(user?.name ?? '')
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user?.name ?? '—'}</p>
            <div className="flex items-center gap-1">
              <Shield size={10} className={user?.role === 'Administrateur' ? 'text-purple-500' : 'text-blue-500'} />
              <p className={`text-xs truncate ${user?.role === 'Administrateur' ? 'text-purple-600' : 'text-blue-600'}`}>
                {user?.role ?? 'Membre'}
              </p>
            </div>
          </div>
          <User size={16} className="text-gray-400 shrink-0" />
        </Link>

        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
