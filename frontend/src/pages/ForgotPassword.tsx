import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import api from '@/utils/api';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [devResetLink, setDevResetLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setDevResetLink(null);

    if (!email) {
      setError('Veuillez saisir votre adresse email');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setSuccessMessage(
        response.data.message ||
          'Si un compte actif existe avec cette adresse email, un lien de réinitialisation vous a été envoyé.'
      );
      if (response.data.resetLink) {
        setDevResetLink(response.data.resetLink);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Une erreur est survenue lors de la demande.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-md w-full p-8 bg-white border border-slate-200 space-y-6 shadow-sm rounded-lg">
        {/* Lien retour connexion */}
        <div>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft size={14} />
            Retour à la connexion
          </Link>
        </div>

        {/* Logo / Titre */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-600 text-white mb-3 rounded-lg shadow-sm shadow-blue-500/30">
            <KeyRound size={26} />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Mot de passe oublié</h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
            Saisissez votre adresse email pour recevoir un lien de réinitialisation sécurisé.
          </p>
        </div>

        {error && (
          <div className="bg-rose-50 text-rose-700 p-3.5 flex items-center gap-3 text-xs font-semibold border border-rose-200 rounded-md">
            <AlertCircle size={16} className="shrink-0" />
            {error}
          </div>
        )}

        {successMessage ? (
          <div className="space-y-4">
            <div className="bg-emerald-50 text-emerald-800 p-4 flex items-start gap-3 text-xs font-medium border border-emerald-200 rounded-md">
              <CheckCircle size={18} className="shrink-0 text-emerald-600 mt-0.5" />
              <div>
                <p className="font-bold text-slate-900 mb-1">Demande envoyée</p>
                <p>{successMessage}</p>
              </div>
            </div>

            {devResetLink && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-xs space-y-2">
                <span className="font-bold text-blue-900 block">Lien direct de test (mode développement) :</span>
                <a
                  href={devResetLink}
                  className="text-blue-600 hover:underline break-all font-mono text-[11px] block"
                >
                  {devResetLink}
                </a>
              </div>
            )}

            <div className="pt-2">
              <Link
                to="/login"
                className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold"
              >
                Retourner à la page de connexion
              </Link>
            </div>
          </div>
        ) : (
          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="label">Adresse Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail size={18} />
                </div>
                <input
                  id="forgot-email"
                  type="email"
                  required
                  className="input pl-10"
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button
              id="forgot-submit"
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex items-center justify-center gap-2 py-2.5 disabled:opacity-60 disabled:cursor-not-allowed text-xs font-bold"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
              ) : (
                <>
                  <span>Envoyer les instructions</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}

        <div className="pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Vous vous souvenez de votre mot de passe ?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-bold">
            Se connecter
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
