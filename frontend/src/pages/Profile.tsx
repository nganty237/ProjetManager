import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  User, Mail, Shield, Edit3, Save, X, Camera,
  FolderOpen, CheckCircle, LogOut, AlertCircle
} from 'lucide-react';
import api from '@/utils/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  projects?: { id: string; title: string; status: string }[];
  Tasks?: { id: string; title: string; status: string }[];
}

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser, logout } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editData, setEditData] = useState({ name: '', avatar: '' });

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
      const response = await api.put('/users/me', {
        name: editData.name,
        avatar: editData.avatar || undefined,
      });
      const updatedUser = response.data;
      setProfile((prev) => prev ? { ...prev, ...updatedUser } : prev);
      // Mettre à jour le store Zustand
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

  const getInitials = (name: string) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

  const getRoleBadge = (role: string) => {
    if (role === 'Administrateur') {
      return 'bg-purple-100 text-purple-800 border border-purple-200';
    }
    return 'bg-blue-100 text-blue-800 border border-blue-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="card text-center text-gray-500 py-12">
        <AlertCircle className="mx-auto mb-2 text-red-500" size={32} />
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez vos informations personnelles</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary flex items-center gap-2 text-red-600 hover:bg-red-50"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 text-sm border border-red-200">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 text-sm border border-green-200">
          <CheckCircle size={18} className="shrink-0" />
          {success}
        </div>
      )}

      {/* Carte principale */}
      <div className="card">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative">
            {profile.avatar ? (
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-2xl object-cover shadow-md"
              />
            ) : (
              <div className="w-24 h-24 rounded-2xl bg-primary-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                {getInitials(profile.name)}
              </div>
            )}
            {editing && (
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full border border-gray-200 flex items-center justify-center shadow-sm text-gray-500">
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
                    className="input"
                    placeholder="https://..."
                    value={editData.avatar}
                    onChange={(e) => setEditData({ ...editData, avatar: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-gray-900">{profile.name}</h2>
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-500 text-sm">{profile.email}</span>
                </div>
              </>
            )}

            {/* Badge rôle */}
            <div className="mt-3 flex items-center justify-center sm:justify-start gap-2">
              <Shield size={14} className="text-gray-500" />
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
          <div className="text-3xl font-bold text-primary-600">{totalProjects}</div>
          <div className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            <FolderOpen size={14} />
            Projets
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
          <div className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            <CheckCircle size={14} />
            Tâches terminées
          </div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600">{totalTasks}</div>
          <div className="text-sm text-gray-500 mt-1 flex items-center justify-center gap-1">
            <User size={14} />
            Total tâches
          </div>
        </div>
      </div>

      {/* Projets récents */}
      {profile.projects && profile.projects.length > 0 && (
        <div className="card">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FolderOpen size={18} className="text-primary-600" />
            Mes projets ({totalProjects})
          </h3>
          <div className="space-y-2">
            {profile.projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm font-medium text-gray-800">{project.title}</span>
                <span className={`badge text-xs ${
                  project.status === 'completed' ? 'bg-green-100 text-green-700' :
                  project.status === 'active' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-600'
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
};

export default Profile;
