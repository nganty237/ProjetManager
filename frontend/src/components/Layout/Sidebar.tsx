
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
import { UserAvatar } from '@/components/Common/UserAvatar';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: () => void;
}

export function Sidebar({ isOpen, onClose, onCreateProject }: SidebarProps) {
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

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 w-64 bg-white/95 backdrop-blur-md border-r border-slate-200/80 text-slate-800 flex flex-col transition-transform duration-300 lg:static lg:translate-x-0 shadow-sm
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* Logo & Close Button (Mobile) */}
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h1 className="text-lg font-bold tracking-tight text-slate-900 flex items-center gap-3">
          <div className="p-2.5 bg-blue-600 rounded-xl shadow-md shadow-blue-600/20 text-white">
            <FolderKanban size={22} />
          </div>
          <span className="bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent font-extrabold">
            PROJET MANAGER
          </span>
        </h1>
        <button
          onClick={onClose}
          className="p-1 lg:hidden text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Bouton Nouveau Projet - Seulement pour Administrateurs */}
      {user?.role === 'Administrateur' && (
        <div className="p-4">
          <button
            onClick={onCreateProject}
            className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 text-sm"
          >
            <PlusCircle size={18} />
            Nouveau Projet
          </button>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 font-semibold'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <Icon size={19} className={active ? 'text-white' : 'text-slate-500'} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer – Utilisateur connecté */}
      <div className="p-4 border-t border-slate-100">
        <Link
          to="/profile"
          onClick={() => onClose()}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all mb-2 ${
            location.pathname === '/profile'
              ? 'bg-blue-50 text-blue-700 font-semibold'
              : 'hover:bg-slate-100/80 text-slate-700'
          }`}
        >
          {/* Avatar avec fallback automatique */}
          <UserAvatar name={user?.name ?? '—'} avatar={user?.avatar} size="sm" />
          
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{user?.name ?? '—'}</p>
            <div className="flex items-center gap-1.5">
              <Shield size={12} className={user?.role === 'Administrateur' ? 'text-amber-500' : 'text-blue-500'} />
              <p className={`text-xs truncate ${user?.role === 'Administrateur' ? 'text-amber-600 font-medium' : 'text-blue-600'}`}>
                {user?.role ?? 'Membre'}
              </p>
            </div>
          </div>
          <User size={16} className="text-slate-400 shrink-0" />
        </Link>

        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
        >
          <LogOut size={16} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
