import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import {
  Shield, Edit3, Save,
  LogOut, AlertCircle, CheckCircle
} from 'lucide-react';
import api from '@/utils/api';
import { UserAvatar } from '@/components/Common/UserAvatar';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
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
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setEditing(true);
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
      setAvatarPreview(null);
      setAvatarFile(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({ name: profile.name, avatar: profile.avatar || '' });
    }
    setAvatarFile(null);
    setAvatarPreview(null);
    setEditing(false);
    setError('');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Mon Profil</h1>
          <p className="text-slate-500 mt-0.5 text-xs sm:text-sm">Gérez vos informations personnelles</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn btn-secondary flex items-center gap-2 text-rose-600 hover:bg-rose-50 border-rose-200 text-xs sm:text-sm px-3 py-1.5 rounded-lg"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-50 text-rose-700 p-3.5 rounded-lg flex items-center gap-3 text-xs font-semibold border border-rose-200">
          <AlertCircle size={18} className="shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-3.5 rounded-lg flex items-center gap-3 text-xs font-semibold border border-emerald-200">
          <CheckCircle size={18} className="shrink-0" />
          {success}
        </div>
      )}

      {/* Card principale - Style Profile Information */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
            Profile information
          </h2>
        </div>

        {/* Ligne 1: Profile photo */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 block">
            Profile
          </label>
          <div className="flex items-center gap-3.5">
            <div className="relative shrink-0">
              <UserAvatar
                name={profile.name}
                avatar={avatarPreview || profile.avatar}
                size="lg"
                className="w-14 h-14 text-lg border border-slate-200 shadow-xs"
              />
            </div>
            
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold px-3.5 py-2 rounded-lg transition-colors cursor-pointer border border-slate-200/60"
            >
              Upload photo
            </button>
          </div>
        </div>

        {/* Ligne 2: Display name */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Display name
          </label>
          {editing ? (
            <input
              type="text"
              value={editData.name}
              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all shadow-xs"
              placeholder="Votre nom complet"
              autoFocus
            />
          ) : (
            <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-900 font-medium">
              {profile.name}
            </div>
          )}
        </div>

        {/* Ligne 3: Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Email
          </label>
          <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-600">
            {profile.email}
          </div>
        </div>

        {/* Ligne 4: Rôle */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">
            Rôle
          </label>
          <div className="w-full bg-slate-50/70 border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 flex items-center gap-2">
            <Shield size={15} className="text-slate-400" />
            <span className="font-semibold text-slate-700">{profile.role}</span>
          </div>
        </div>

        {/* Boutons d'action */}
        <div className="pt-2">
          {editing ? (
            <div className="flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-sm px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                Annuler
              </button>
            </div>
          ) : (
            <button
              onClick={() => { setEditing(true); setSuccess(''); }}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer shadow-sm flex items-center gap-2"
            >
              <Edit3 size={15} />
              Modifier
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;

