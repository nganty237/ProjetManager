import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Lock, Palette, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/utils/api';

export function Settings() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();
  const isAdmin = user?.role === 'ADMINISTRATEUR';

  // Profil Form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Security Form
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });

  const handleProfileSave = async () => {
    setProfileMsg({ type: '', text: '' });
    if (!email) return setProfileMsg({ type: 'error', text: 'Email requis' });
    if (!name) return setProfileMsg({ type: 'error', text: 'Nom requis' });
    
    try {
      const res = await api.put('/users/me', { 
        email, 
        name
      });
      updateUser(res.data);
      setProfileMsg({ type: 'success', text: 'Profil mis à jour avec succès' });
    } catch (err: any) {
      setProfileMsg({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la mise à jour' });
    }
  };

  const handlePasswordSave = async () => {
    setSecurityMsg({ type: '', text: '' });
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return setSecurityMsg({ type: 'error', text: 'Veuillez remplir tous les champs' });
    }
    if (passwords.new !== passwords.confirm) {
      return setSecurityMsg({ type: 'error', text: 'Les nouveaux mots de passe ne correspondent pas' });
    }
    if (passwords.new.length < 6) {
      return setSecurityMsg({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' });
    }

    try {
      await api.put('/users/me/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      setSecurityMsg({ type: 'success', text: 'Mot de passe mis à jour !' });
      setPasswords({ current: '', new: '', confirm: '' });
    } catch (err: any) {
      setSecurityMsg({ type: 'error', text: err.response?.data?.message || 'Erreur lors du changement de mot de passe' });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Paramètres</h1>
        <p className="text-slate-500 mt-1 text-sm">Gérez les paramètres de votre application</p>
      </div>
      
      <div className="space-y-6">
        {/* Profil */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <User className="text-blue-600" size={22} />
            <h2 className="text-xl font-extrabold text-slate-900">Profil</h2>
          </div>
          {profileMsg.text && (
            <div className={`p-3 mb-4 rounded-md text-xs font-semibold ${profileMsg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {profileMsg.text}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="label">Nom complet</label>
              <input 
                type="text" 
                className="input" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Email</label>
              <input 
                type="email" 
                className="input" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div>
              <label className="label">Rôle</label>
              <input type="text" className="input bg-slate-100" value={user?.role || ''} disabled />
            </div>
            <button className="btn btn-primary" onClick={handleProfileSave}>Sauvegarder l'email</button>
          </div>
        </div>
        
        {/* Sécurité */}
        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="text-rose-600" size={22} />
            <h2 className="text-xl font-extrabold text-slate-900">Sécurité</h2>
          </div>
          {securityMsg.text && (
            <div className={`p-3 mb-4 rounded-md text-xs font-semibold ${securityMsg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
              {securityMsg.text}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="label">Mot de passe actuel</label>
              <input 
                type="password" 
                className="input" 
                placeholder="••••••••" 
                value={passwords.current}
                onChange={(e) => setPasswords({...passwords, current: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Nouveau mot de passe</label>
              <input 
                type="password" 
                className="input" 
                placeholder="••••••••" 
                value={passwords.new}
                onChange={(e) => setPasswords({...passwords, new: e.target.value})}
              />
            </div>
            <div>
              <label className="label">Confirmer le nouveau mot de passe</label>
              <input 
                type="password" 
                className="input" 
                placeholder="••••••••" 
                value={passwords.confirm}
                onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
              />
            </div>
            <button className="btn btn-primary" onClick={handlePasswordSave}>Changer le mot de passe</button>
          </div>
        </div>

        {/* Administration */}
        {isAdmin && (
          <div className="card border-l-4 border-l-amber-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <Shield className="text-amber-600" size={22} />
                <h2 className="text-xl font-extrabold text-slate-900">Administration & Utilisateurs</h2>
              </div>
              <button 
                onClick={() => navigate('/admin/users')}
                className="btn btn-primary text-xs font-bold flex items-center gap-2 self-start sm:self-auto cursor-pointer"
              >
                <Shield size={14} />
                <span>Ouvrir la console d'administration</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              En tant qu'administrateur, vous pouvez créer des comptes utilisateurs, envoyer/renvoyer des invitations sécurisées, changer les rôles, désactiver/réactiver et supprimer des utilisateurs.
            </p>
          </div>
        )}
        
        {/* Notifications */}
        <div className="card opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="text-amber-500" size={22} />
            <h2 className="text-xl font-extrabold text-slate-900">Notifications</h2>
          </div>
          <div className="space-y-3 pointer-events-none text-xs">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
              <div>
                <div className="font-bold text-slate-900">Notifications par email</div>
                <div className="text-slate-500">Recevoir des notifications par email pour les mises à jour</div>
              </div>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" defaultChecked />
              <div>
                <div className="font-bold text-slate-900">Notifications de tâches</div>
                <div className="text-slate-500">Être notifié quand une tâche vous est assignée</div>
              </div>
            </label>
          </div>
        </div>
        
        {/* Apparence */}
        <div className="card opacity-60">
          <div className="flex items-center gap-3 mb-4">
            <Palette className="text-indigo-600" size={22} />
            <h2 className="text-xl font-extrabold text-slate-900">Apparence</h2>
          </div>
          <div className="space-y-4 pointer-events-none text-xs">
            <div>
              <label className="label">Thème</label>
              <select className="input cursor-not-allowed">
                <option>Clair</option>
                <option>Sombre</option>
                <option>Automatique</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Settings;
