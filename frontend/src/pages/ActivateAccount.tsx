import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Lock, CheckCircle, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import api from '@/utils/api';

export function ActivateAccount() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();

  const [loadingVerify, setLoadingVerify] = useState(true);
  const [userInfo, setUserInfo] = useState<{ name: string; email: string; role: string } | null>(null);
  const [tokenError, setTokenError] = useState('');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setTokenError("Token d'invitation manquant");
        setLoadingVerify(false);
        return;
      }
      try {
        const res = await api.get(`/auth/verify-invitation/${token}`);
        setUserInfo(res.data.user);
      } catch (err: any) {
        const msg = err.response?.data?.message || "Ce lien d'invitation est invalide ou a expiré.";
        setTokenError(msg);
      } finally {
        setLoadingVerify(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (password !== confirmPassword) {
      setFormError('Les deux mots de passe ne correspondent pas');
      return;
    }

    if (password.length < 6) {
      setFormError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/auth/activate', {
        token,
        password,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Erreur lors de l'activation du compte";
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleLabel = (role?: string) => {
    if (role === 'ADMINISTRATEUR') return 'Administrateur';
    if (role === 'CHEF_DE_PROJET') return 'Chef de projet';
    return 'Membre';
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-md w-full p-8 bg-white border border-slate-200 rounded-lg shadow-sm space-y-6">
        
        {/* En-tête */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white rounded-xl mb-4 shadow-sm">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Activation de Compte
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Bienvenue sur <span className="font-bold text-slate-900">PROJET MANAGER</span>
          </p>
        </div>

        {/* Chargement de vérification */}
        {loadingVerify && (
          <div className="text-center py-8 space-y-3">
            <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Vérification du lien d'invitation...</p>
          </div>
        )}

        {/* Erreur de token */}
        {!loadingVerify && tokenError && (
          <div className="space-y-5">
            <div className="bg-rose-50 text-rose-700 p-4 rounded-lg flex items-start gap-3 text-xs font-semibold border border-rose-200">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 mb-1">Lien invalide</p>
                <p>{tokenError}</p>
              </div>
            </div>
            <Link
              to="/login"
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
            >
              Retour à la page de connexion
            </Link>
          </div>
        )}

        {/* Formulaire d'activation */}
        {!loadingVerify && userInfo && !tokenError && (
          <>
            {/* Informations utilisateur invité */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-1">
              <p className="text-slate-500 font-medium">Compte invité :</p>
              <p className="font-bold text-slate-900 text-sm">{userInfo.name}</p>
              <p className="text-slate-600">{userInfo.email}</p>
              <div className="pt-1">
                <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                  Rôle : {getRoleLabel(userInfo.role)}
                </span>
              </div>
            </div>

            {formError && (
              <div className="bg-rose-50 text-rose-700 p-3.5 rounded-lg flex items-center gap-2.5 text-xs font-semibold border border-rose-200">
                <AlertCircle size={16} className="shrink-0" />
                {formError}
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 text-emerald-700 p-4 rounded-lg flex items-start gap-3 text-xs font-semibold border border-emerald-200">
                <CheckCircle size={18} className="shrink-0 mt-0.5 text-emerald-600" />
                <div>
                  <p className="font-bold text-slate-900 mb-0.5">Compte activé avec succès !</p>
                  <p className="text-slate-600">Redirection automatique vers la page de connexion...</p>
                </div>
              </div>
            )}

            {!success && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="label">Définir votre mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="•••••••• (min. 6 caractères)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="input pl-9 pr-10 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="label">Confirmer le mot de passe</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock size={16} />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="input pl-9 text-xs"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold disabled:opacity-60"
                >
                  {submitting ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Activer mon compte</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

        <div className="pt-2 text-center border-t border-slate-100">
          <Link to="/login" className="text-xs text-blue-600 hover:underline font-bold">
            Aller à la connexion
          </Link>
        </div>

      </div>
    </div>
  );
}

export default ActivateAccount;