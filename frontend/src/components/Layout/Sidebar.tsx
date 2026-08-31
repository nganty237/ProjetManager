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
  Wallet,
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
  const isAdmin = user?.role === 'Administrateur';

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Tableau de bord' },
    { path: '/projects', icon: FolderKanban, label: 'Projets' },
    { path: '/team', icon: Users, label: 'Équipe' },
    ...(isAdmin ? [{ path: '/finance', icon: Wallet, label: 'Finances' }] : []),
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
        fixed inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 text-slate-800 flex flex-col transition-transform duration-200 lg:static lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="p-5 border-b border-slate-200 flex items-center justify-between">
        <h1 className="text-base font-extrabold tracking-tight text-slate-900 flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 text-white rounded-md">
            <FolderKanban size={20} />
          </div>
          <span className="font-extrabold text-slate-900 tracking-tight">
            PROJET MANAGER
          </span>
        </h1>
        <button
          onClick={onClose}
          className="p-1 lg:hidden text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {isAdmin && (
        <div className="p-3.5">
          <button
            onClick={onCreateProject}
            className="btn btn-primary w-full py-2 px-3.5 flex items-center justify-center gap-2 text-xs sm:text-sm"
          >
            <PlusCircle size={16} />
            Nouveau Projet
          </button>
        </div>
      )}

      <nav className="flex-1 p-3.5 overflow-y-auto">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => onClose()}
                  className={`flex items-center gap-2.5 px-3 py-2.5 text-xs font-bold transition-colors rounded-md ${
                    active
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon size={18} className={active ? 'text-white' : 'text-slate-500'} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-3.5 border-t border-slate-200">
        <Link
          to="/profile"
          onClick={() => onClose()}
          className={`flex items-center gap-2.5 px-2.5 py-2 transition-colors mb-1 rounded-md ${
            location.pathname === '/profile'
              ? 'bg-slate-100 text-blue-700 font-bold border-l-2 border-blue-600'
              : 'hover:bg-slate-100 text-slate-700'
          }`}
        >
          <UserAvatar name={user?.name ?? '—'} avatar={user?.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">{user?.name ?? '—'}</p>
            <div className="flex items-center gap-1">
              <Shield size={11} className={user?.role === 'Administrateur' ? 'text-amber-600' : 'text-blue-600'} />
              <p className={`text-[11px] truncate ${user?.role === 'Administrateur' ? 'text-amber-700 font-semibold' : 'text-blue-600'}`}>
                {user?.role ?? 'Membre'}
              </p>
            </div>
          </div>
          <User size={15} className="text-slate-400 shrink-0" />
        </Link>

        <button
          id="sidebar-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer rounded-md"
        >
          <LogOut size={15} />
          Déconnexion
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
