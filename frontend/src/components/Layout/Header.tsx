import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, Settings, Bell, HelpCircle, Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { useProjectStore } from '@/store/projectStore';
import { UserAvatar } from '@/components/Common/UserAvatar';

interface HeaderProps {
  onMenuClick: () => void;
}

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
    <header className="bg-white/90 backdrop-blur-md sticky top-0 z-20 w-full border-b border-slate-200/80 shadow-2xs border-t-2 border-slate-800">
      <div className="px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Gauche: Menu mobile + Titre Espace + Search Bar */}
        <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
          <button
            onClick={onMenuClick}
            className="p-1.5 lg:hidden text-slate-600 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            title="Menu"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center gap-2 shrink-0">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
            <span className="text-xs sm:text-sm font-bold text-slate-900 tracking-tight whitespace-nowrap">
              Espace de Travail
            </span>
          </div>

          <div className="hidden md:block h-4 w-px bg-slate-200 shrink-0" />

          {/* Barre de recherche style pilule épurée */}
          <div className="relative flex-1 max-w-xs hidden xs:block">
            <input
              type="text"
              value={filters.search || ''}
              onChange={handleSearchChange}
              placeholder="Rechercher un projet..."
              className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 border border-slate-200/70 rounded-full pl-3.5 pr-9 py-1.5 text-xs text-slate-700 placeholder-slate-400 outline-none transition-all"
            />
            <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Droite: Notifications, Aide et Menu Profil style pilule */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Bouton de notifications avec badge rouge */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/70 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
              title="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 top-11 w-72 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-20 p-3 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                    <span className="text-xs font-bold text-slate-900">Notifications</span>
                    <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">Nouveau</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <p className="font-semibold text-slate-800">Bienvenue dans votre espace</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Toutes les fonctionnalités sont prêtes.</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bouton d'aide */}
          <button
            onClick={() => navigate('/settings')}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100/70 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer hidden sm:flex"
            title="Aide & Réglages"
          >
            <HelpCircle size={16} />
          </button>

          <div className="h-5 w-px bg-slate-200 mx-0.5 hidden sm:block" />

          {/* Menu Profil utilisateur style pilule avec Avatar et Nom */}
          <div className="relative">
            <button
              id="header-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 py-1 px-1.5 sm:pr-2.5 rounded-full hover:bg-slate-100/80 transition-all border border-transparent hover:border-slate-200/60 cursor-pointer focus:outline-none"
            >
              <UserAvatar name={user?.name ?? 'Utilisateur'} avatar={user?.avatar} size="sm" />
              <span className="text-xs font-bold text-slate-800 hidden sm:inline-block max-w-[120px] truncate">
                {user?.name ?? 'Mon compte'}
              </span>
              <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu Déroulant du Profil */}
            {showDropdown && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowDropdown(false)}
                />
                <div className="absolute right-0 top-12 w-60 bg-white rounded-2xl shadow-xl border border-slate-200/90 z-20 overflow-hidden p-2 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-3 bg-slate-50/80 rounded-xl mb-1.5 border border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">{user?.email}</p>
                    <span className={`mt-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      user?.role === 'Administrateur' ? 'bg-amber-100 text-amber-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user?.role ?? 'Membre'}
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <User size={15} className="text-slate-400" />
                    Mon profil
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Settings size={15} className="text-slate-400" />
                    Paramètres
                  </Link>
                  <hr className="my-1.5 border-slate-100" />
                  <button
                    id="header-logout-btn"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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
