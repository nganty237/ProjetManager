import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, User, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/utils/api';

export function Signup() {
  const navigate = useNavigate();
  const loginStore = useAuthStore((state) => state.login);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Membre',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/signup', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      const loginResponse = await api.post('/auth/login', {
        email: formData.email,
        password: formData.password,
      });

      const { user, token } = loginResponse.data;
      loginStore(user, token);

      setSuccess(true);
      setTimeout(() => navigate('/'), 1000);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-md w-full p-8 bg-white border border-slate-200 space-y-8">
        {/* Logo / Titre */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white mb-4">
            <UserPlus size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Inscription</h1>
          <p className="mt-1.5 text-sm text-slate-600">
            Rejoignez <span className="font-semibold text-slate-900">PROJET MANAGER</span>
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3.5 flex items-center gap-3 text-xs font-semibold border border-rose-200">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-emerald-50 text-emerald-700 p-3.5 flex items-center gap-3 text-xs font-semibold border border-emerald-200">
            <span>✓</span>
            Compte créé avec succès ! Redirection...
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nom complet */}
          <div>
            <label className="label">Nom complet</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <User size={18} />
              </div>
              <input
                id="signup-name"
                type="text"
                required
                className="input pl-10"
                placeholder="Ex: Jean Dupont"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input
                id="signup-email"
                type="email"
                required
                className="input pl-10"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div>
            <label className="label">Mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                id="signup-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="input pl-10 pr-10"
                placeholder="••••••••  (min. 6 caractères)"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirmer le mot de passe */}
          <div>
            <label className="label">Confirmer le mot de passe</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input
                id="signup-confirm-password"
                type={showPassword ? 'text' : 'password'}
                required
                className="input pl-10"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Rôle */}
          <div>
            <label className="label">Type de compte</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Shield size={18} />
              </div>
              <select
                className="input pl-10 appearance-none bg-white"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="Membre">Membre (Accès standard)</option>
                <option value="Administrateur">Administrateur (Gestion complète)</option>
              </select>
            </div>
          </div>

          <button
            id="signup-submit"
            type="submit"
            disabled={loading || success}
            className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <>
                <UserPlus size={18} />
                S'inscrire
              </>
            )}
          </button>
        </form>

        <p className="text-center text-xs text-slate-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
