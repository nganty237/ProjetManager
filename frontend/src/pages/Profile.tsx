import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  User, Mail, Shield, Edit3, Save, X, Camera,
  FolderOpen, CheckCircle, LogOut, AlertCircle
} from 'lucide-react';
import api from '@/utils/api';
import { UserAvatar } from '@/components/Common/UserAvatar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  projects?: { id: string; title: string; status: string }[];
  Tasks?: { id: string; title: string; status: string }[];
}

export function Profile() {
  const navigate = useNavigate();
  const { updateUser, logout } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState({ name: '', avatar: '' });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get('/users/me');
      setProfile(response.data);
      setEditData({ name: response.data.name, avatar: response.data.avatar || '' });
    } catch (err: any) {
      setError('Impossible de charger le profil');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      let response;
      if (avatarFile) {
        const formData = new FormData();
        formData.append('name', editData.name);
        formData.append('avatarFile', avatarFile);
        response = await api.put('/users/me', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        response = await api.put('/users/me', {
          name: editData.name,
          avatar: editData.avatar || undefined,
        });
      }
      const updatedUser = response.data;
      setProfile((prev) => prev ? { ...prev, ...updatedUser } : prev);
      updateUser(updatedUser);
      setSuccess('Profil mis à jour avec succès !');
      setEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getRoleBadge = (role: string) => {
    if (role === 'Administrateur') {
      return 'bg-amber-50 text-amber-800 border border-amber-200';
    }
    return 'bg-blue-50 text-blue-800 border border-blue-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card text-center text-slate-500 py-12">
        <AlertCircle className="mx-auto mb-2 text-rose-600" size={32} />
        Impossible de charger le profil.
      </div>
    );
  }

  const completedTasks = profile.Tasks?.filter((t) => t.status === 'done').length ?? 0;
  const totalTasks = profile.Tasks?.length ?? 0;
  const totalProjects = profile.projects?.length ?? 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Mon Profil</h1>
          <p className="text-slate-500 mt-1 text-sm">Gérez vos informations personnelles</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary flex items-center gap-2 text-rose-600 hover:bg-rose-50 border-rose-200"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-3.5 rounded-md flex items-center gap-3 text-xs font-semibold border border-rose-200">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-md flex items-center gap-3 text-xs font-semibold border border-emerald-200">
          <CheckCircle size={18} className="shrink-0" />
          {success}
        </div>
      )}

      {/* Carte principale */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            <UserAvatar name={profile.name} avatar={profile.avatar} size="xl" className="w-24 h-24 text-2xl" />
            {editing && (
              <div 
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded border border-slate-300 flex items-center justify-center text-slate-600 cursor-pointer hover:bg-slate-50"
                onClick={() => fileInputRef.current?.click()}
                title="Changer d'avatar"
              >
                <Camera size={14} />
              </div>
            )}
          </div>

          {/* Informations */}
          <div className="flex-1 text-center sm:text-left">
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="label text-left">Nom complet</label>
                  <input
                    id="profile-name"
                    type="text"
                    className="input"
                    value={editData.name}
                    onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="label text-left">URL de l'avatar (optionnel)</label>
                  <input
                    id="profile-avatar"
                    type="url"
                    className="input mb-2"
                    placeholder="https://..."
                    value={editData.avatar}
                    onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                  />
                  <div className="text-center text-xs font-semibold text-slate-400 my-2">— OU —</div>
                  <label className="label text-left">Télécharger une image depuis votre PC</label>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-md file:border-0
                      file:text-xs file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100 border border-slate-300 rounded-md p-1"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        setAvatarFile(e.target.files[0]);
                        setEditData({ ...editData, avatar: '' });
                      }
                    }}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-extrabold text-slate-900">{profile.name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Mail size={14} className="text-slate-400" />
                  <span className="text-slate-600 text-sm">{profile.email}</span>
                </div>
              </>
            )}

            {/* Badge rôle */}
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
              <Shield size={14} className="text-slate-500" />
              <span className={`badge ${getRoleBadge(profile.role)}`}>
                {profile.role}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {editing ? (
              <>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn btn-primary flex items-center gap-2"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  Sauvegarder
                </button>
                <button onClick={() => setEditing(false)} className="btn btn-secondary">
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                id="profile-edit"
                onClick={() => { setEditing(true); setSuccess(''); }}
                className="btn btn-secondary flex items-center gap-2"
              >
                <Edit3 size={16} />
                Modifier
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-blue-600">{totalProjects}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1 font-semibold">
            <FolderOpen size={14} />
            Projets
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-emerald-600">{completedTasks}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1 font-semibold">
            <CheckCircle size={14} />
            Tâches terminées
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-extrabold text-indigo-600">{totalTasks}</div>
          <div className="text-xs text-slate-500 mt-1 flex items-center justify-center gap-1 font-semibold">
            <User size={14} />
            Total tâches
          </div>
        </div>
      </div>

      {/* Projets récents */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="card">
          <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
            <FolderOpen size={18} className="text-blue-600" />
            Mes projets ({totalProjects})
          </h3>
          <div className="space-y-2">
            {profile.projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm font-semibold text-slate-800">{project.title}</span>
                <span className={`badge text-xs ${
                  project.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                  project.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
