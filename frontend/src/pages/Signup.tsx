import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, UserPlus, User, AlertCircle, Eye, EyeOff, Shield } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import api from '@/utils/api';

const Signup: React.FC = () => {
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

      // Connexion automatique après inscription réussie
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
    <div className="min-h-screen flex items-center justify-center bg-body px-4 relative overflow-hidden">
      {/* Decorative background blobs for premium feel */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-300 rounded-full mix-blend-multiply filter blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>

      <div className="max-w-md w-full space-y-8 glass-card relative z-10">
        {/* Logo / Titre */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-600 text-white mb-4 shadow-lg">
            <UserPlus size={28} />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Inscription</h1>
          <p className="mt-2 text-sm text-gray-600">Rejoignez <span className="font-semibold text-primary-600">PROJET MANAGER</span></p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 text-sm border border-red-200">
            <AlertCircle size={18} className="shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-center gap-3 text-sm border border-green-200">
            <span className="text-lg">✓</span>
            Compte créé avec succès ! Redirection vers votre espace...
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nom complet */}
          <div>
            <label className="label">Nom complet</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <User size={18} />
              </div>
              <input
                id="signup-name"
                type="text"
                required
                className="input pl-10"
                placeholder="nganty gabriel"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="label">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
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
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <Shield size={18} />
              </div>
              <select
                className="input pl-10 appearance-none"
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
            className="btn btn-primary w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus size={20} />
                S'inscrire
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Vous avez déjà un compte ?{' '}
          <Link to="/login" className="text-primary-600 font-semibold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
