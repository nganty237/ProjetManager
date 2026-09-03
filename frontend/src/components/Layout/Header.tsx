import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, Settings, Bell, HelpCircle, Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { UserAvatar } from '@/components/Common/UserAvatar';

interface HeaderProps {
  onMenuClick: () => void;
}

/**
 * Corporate header navigation component with search bar, notifications, and user account menu.
 */
export function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { filters, setFilters } = useProjectStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search: e.target.value });
  };

  return (
    <header className="bg-white sticky top-0 z-20 w-full border-b border-slate-200">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-1.5 lg:hidden text-slate-600 hover:bg-slate-100 transition-colors shrink-0 cursor-pointer"
            title="Menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
            <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
              Espace de Travail
            </span>
          </div>

          <div className="relative flex-1 max-w-xs hidden xs:block">
            <input
              type="text"
              value={filters.search || ''}
              onChange={handleSearchChange}
              placeholder="Rechercher un projet..."
              className="w-full bg-slate-50 focus:bg-white focus:border-blue-600 border border-slate-200 pl-3.5 pr-9 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none transition-colors"
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-slate-100 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full" />
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-11 w-72 bg-white border border-slate-200 z-20 p-3 shadow-md rounded-md">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 mb-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 border border-blue-200 rounded">Nouveau</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 bg-slate-50 border border-slate-200 rounded-md">
                      <p className="font-semibold text-slate-800">Bienvenue dans votre espace</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Toutes les fonctionnalités sont prêtes.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          <button
            onClick={() => navigate('/settings')}
            className="p-2 hover:bg-slate-100 rounded-md flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors cursor-pointer hidden sm:flex"
            title="Aide & Réglages"
          >
            <HelpCircle size={18} />
          </button>

          <div className="relative">
            <button
              id="header-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 py-1 px-1.5 sm:pr-2.5 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 cursor-pointer focus:outline-none"
            >
              <UserAvatar name={user?.name ?? 'Utilisateur'} avatar={user?.avatar} size="sm" />
              <span className="text-xs font-bold text-slate-800 hidden sm:inline-block max-w-[120px] truncate">
                {user?.name ?? 'Mon compte'}
              </span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-12 w-60 bg-white border border-slate-200 z-20 overflow-hidden p-2 shadow-md rounded-md">
                  <div className="px-3 py-2.5 pb-2 mb-1.5 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                    <span className={`mt-1.5 inline-block text-[10px] font-bold uppercase tracking-wider ${
                      user?.role === 'Administrateur' ? 'text-amber-600' : 'text-blue-600'
                    }`}>
                      {user?.role ?? 'Membre'}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <User size={15} className="text-slate-400" />
                    Mon profil
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <Settings size={15} className="text-slate-400" />
                    Paramètres
                  </Link>
                  <hr className="my-1.5 border-slate-200" />
                  <button
                    id="header-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  >
                    <LogOut size={15} />
                    Déconnexion
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
