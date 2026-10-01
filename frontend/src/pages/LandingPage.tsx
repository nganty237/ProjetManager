import { Link } from 'react-router-dom';
import { 
  FolderKanban, 
  CheckCircle2, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  ArrowRight, 
  Layers, 
  BarChart3, 
  Lock,
  ChevronRight
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-blue-600 selection:text-white">
      {/* Header Public */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-sm">
              <FolderKanban className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">PROJET MANAGER</span>
              <span className="text-xs text-slate-400 font-normal">| Plateforme Entreprise</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#roles" className="hover:text-white transition-colors">Gouvernance & Rôles</a>
            <a href="#security" className="hover:text-white transition-colors">Sécurité</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white rounded-md text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <span>Espace Connexion</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1 : Hero avec Dégradé Élégant et Moderne */}
      <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-b border-slate-800 text-white">
        {/* Subtle Radial Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.20),rgba(255,255,255,0))] pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/80 text-slate-300 text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>
            Gestion de portefeuilles & projets d'organisation
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Pilotez l'exécution, les équipes et les finances de vos projets
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            Une infrastructure centralisée et sécurisée pour coordonner les plannings opérationnels, maîtriser les dépenses en temps réel et aligner l'ensemble des collaborateurs.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-sm rounded-md shadow-sm transition-colors flex items-center justify-center gap-2"
            >
              <span>Accéder à l'application</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-xs font-medium text-slate-400 border-t border-slate-800/80 max-w-3xl mx-auto">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Contrôle d'accès par rôles</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Suivi financier en FCFA</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Hébergement souverain</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 : Fonctionnalités sur Fond Clair avec Icônes aux Couleurs Visibles */}
      <section id="features" className="py-20 sm:py-24 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-blue-600">Capacités de la plateforme</h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Une suite d'outils pensée pour la rigueur opérationnelle
            </p>
            <p className="text-sm text-slate-600 max-w-xl mx-auto">
              Chaque module est conçu pour apporter clarté et précision à vos processus d'entreprise.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Carte 1 : Pilotage de Portefeuille (Bleu) */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 bg-blue-50 text-blue-600 border border-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Pilotage de Portefeuille</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Supervisez l'état d'avancement de tous les chantiers, fixez les priorités, attribuez les responsabilités et suivez les échéances.
              </p>
            </div>

            {/* Carte 2 : Kanban & Tâches (Émeraude / Vert) */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg hover:border-emerald-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Tableau Kanban & Tâches</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Organisation fluide des flux de travail : À faire, En cours, En revue, Terminé. Affectation nominative des tâches aux collaborateurs.
              </p>
            </div>

            {/* Carte 3 : Finance & Dépenses (Indigo / Violet) */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg hover:border-indigo-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <DollarSign className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Gestion Budgétaire & Dépenses</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enregistrement détaillé des postes de dépenses par projet, contrôle du budget consommé et génération de rapports de conformité PDF.
              </p>
            </div>

            {/* Carte 4 : Équipe & Rôles (Ambre / Doré) */}
            <div id="roles" className="p-6 bg-white border border-slate-200 rounded-lg hover:border-amber-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 bg-amber-50 text-amber-600 border border-amber-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Gouvernance & Gestion d'Équipe</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Système d'invitation sécurisé par token. Droits d'accès séparés pour l'Administrateur, les Chefs de projet et les Membres.
              </p>
            </div>

            {/* Carte 5 : Sécurité (Bleu Ciel / Cyan) */}
            <div id="security" className="p-6 bg-white border border-slate-200 rounded-lg hover:border-sky-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 bg-sky-50 text-sky-600 border border-sky-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Sécurité & Intégrité des Accès</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Authentification par JSON Web Tokens (JWT) signés, hachage bcrypt des identifiants et isolation stricte des privilèges.
              </p>
            </div>

            {/* Carte 6 : Instance Dédiée (Ardoise Neutre) */}
            <div className="p-6 bg-white border border-slate-200 rounded-lg hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="w-11 h-11 bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center justify-center mb-4">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">Instance Dédiée</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Vos bases de données et vos fichiers restent entièrement sous le contrôle de votre structure organisationnelle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 : Bannière d'Action */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Prêt à collaborer avec votre équipe ?
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            Accédez à votre espace de travail pour planifier, exécuter et superviser vos projets en temps réel.
          </p>
          <div>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm rounded-md shadow-sm transition-colors"
            >
              <span>Accéder à l'espace de connexion</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer Pro & Clair */}
      <footer className="bg-slate-50 py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold text-slate-800">
            <FolderKanban className="w-4 h-4 text-blue-600" />
            <span>PROJET MANAGER</span>
          </div>
          <p>© {new Date().getFullYear()} PROJET MANAGER. Plateforme de gestion d'entreprise.</p>
          <div className="flex items-center gap-4 text-slate-500">
            <Link to="/login" className="hover:text-blue-600 transition-colors">Se connecter</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
