import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Menu, LogOut, Settings } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name: string) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) ?? '?';

  return (
    <header className="glass sticky top-0 z-10 w-full border-b border-white/40">
      <div className="px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="p-2 lg:hidden text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 hidden sm:block">
            Espace de Travail
          </h2>
        </div>

        {/* Zone utilisateur */}
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3 pl-3 sm:pl-4 border-l border-gray-200">
            {/* Infos nom & rôle */}
            <div className="text-right hidden xs:block">
              <div className="text-sm font-medium text-gray-900">{user?.name ?? 'Utilisateur'}</div>
              <div className={`text-xs font-medium ${user?.role === 'Administrateur' ? 'text-purple-600' : 'text-blue-600'}`}>
                {user?.role ?? 'Membre'}
              </div>
            </div>

            {/* Bouton avatar */}
            <button
              id="header-profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              className="w-9 h-9 sm:w-10 sm:h-10 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors font-semibold text-sm"
            >
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                getInitials(user?.name ?? '')
              )}
            </button>
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <>
              {/* Overlay pour fermer */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowDropdown(false)}
              />
              <div className="absolute right-0 top-12 w-52 glass-card border border-white/40 z-20 overflow-hidden !p-2 !rounded-xl">
                <div className="px-3 py-2 border-b border-gray-100/50 mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">{user?.name}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                  <span className={`mt-1 inline-block badge text-xs ${user?.role === 'Administrateur' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user?.role}
                  </span>
                </div>

                <Link
                  to="/profile"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <User size={16} className="text-gray-400" />
                  Mon profil
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setShowDropdown(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  <Settings size={16} className="text-gray-400" />
                  Paramètres
                </Link>
                <hr className="my-1 border-gray-100" />
                <button
                  id="header-logout-btn"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Déconnexion
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
