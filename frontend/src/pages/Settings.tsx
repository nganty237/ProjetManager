import { useState, useEffect } from 'react';
import { User, Bell, Lock, Palette, Shield, Trash2 } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/utils/api';

export function Settings() {
  const { user, updateUser } = useAuthStore();
  const isAdmin = user?.role === 'Administrateur';

  // Profil Form
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' });

  // Security Form
  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' });
  const [securityMsg, setSecurityMsg] = useState({ type: '', text: '' });

  // Admin: Team Members
  const [members, setMembers] = useState<any[]>([]);
  const [membersMsg, setMembersMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    if (isAdmin) {
      loadMembers();
    }
  }, [isAdmin]);

  const loadMembers = async () => {
    try {
      const res = await api.get('/users');
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileSave = async () => {
    setProfileMsg({ type: '', text: '' });
    if (!email) return setProfileMsg({ type: 'error', text: 'Email requis' });
    if (isAdmin && !name) return setProfileMsg({ type: 'error', text: 'Nom requis' });
    
    try {
      const res = await api.put('/users/me', { 
        email, 
        name: isAdmin ? name : undefined 
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

  const handleDeleteMember = async (id: string, memberName: string) => {
    if (!window.confirm(`Êtes-vous sûr de vouloir supprimer ${memberName} ?`)) return;
    try {
      await api.delete(`/users/${id}`);
      setMembersMsg({ type: 'success', text: `Membre ${memberName} supprimé.` });
      setMembers(members.filter(m => m.id !== id));
    } catch (err: any) {
      setMembersMsg({ type: 'error', text: err.response?.data?.message || 'Erreur lors de la suppression.' });
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
                className={`input ${!isAdmin ? 'bg-slate-100' : ''}`} 
                value={name} 
                onChange={(e) => setName(e.target.value)}
                disabled={!isAdmin} 
              />
              {!isAdmin && <p className="text-xs text-slate-400 mt-1">Le nom complet ne peut pas être modifié par un membre.</p>}
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
            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-amber-600" size={22} />
              <h2 className="text-xl font-extrabold text-slate-900">Administration - Gestion des Membres</h2>
            </div>
            <p className="text-xs text-slate-500 mb-4">En tant qu'administrateur, vous pouvez gérer les membres de l'application. Vous ne pouvez pas supprimer un autre administrateur.</p>
            
            {membersMsg.text && (
              <div className={`p-3 mb-4 rounded-md text-xs font-semibold ${membersMsg.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                {membersMsg.text}
              </div>
            )}

            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
              {members.map((member) => (
                <div key={member.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-md bg-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs leading-tight">{member.name} {member.id === user?.id && <span className="text-xs text-blue-600 font-normal ml-1">(Vous)</span>}</h4>
                      <p className="text-[11px] text-slate-400">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-2 py-0.5 text-[10px] rounded font-bold border ${member.role === 'Administrateur' ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-blue-50 text-blue-800 border-blue-200'}`}>
                      {member.role}
                    </span>
                    <button 
                      onClick={() => handleDeleteMember(member.id, member.name)}
                      disabled={member.role === 'Administrateur'}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent cursor-pointer"
                      title={member.role === 'Administrateur' ? 'Impossible de supprimer un administrateur' : 'Supprimer le membre'}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
