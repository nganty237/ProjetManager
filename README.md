# Application de Gestion de Projets

Une application web complète de gestion de projets construite avec React, TypeScript et Tailwind CSS.

## 🚀 Fonctionnalités

### Gestion des Projets
- ✅ Créer, modifier et supprimer des projets
- ✅ Statuts multiples (Planification, En cours, En pause, Terminé, Annulé)
- ✅ Niveaux de priorité (Basse, Moyenne, Haute, Critique)
- ✅ Suivi de la progression (0-100%)
- ✅ Gestion du budget et des dépenses
- ✅ Dates de début et de fin
- ✅ Tags personnalisés
- ✅ Détection automatique des retards

### Gestion des Tâches
- ✅ Créer, modifier et supprimer des tâches
- ✅ Statuts de tâches (À faire, En cours, En révision, Terminé)
- ✅ Affectation aux membres de l'équipe
- ✅ Priorités et dates d'échéance
- ✅ Changement rapide de statut

### Gestion d'Équipe
- ✅ Liste des membres de l'équipe avec avatars
- ✅ Rôles et informations de contact
- ✅ Statistiques par membre (projets, tâches, tâches terminées)
- ✅ Affectation multiple aux projets

### Vues Multiples
- ✅ Vue Grille : Cards visuelles des projets
- ✅ Vue Liste : Tableau détaillé
- ✅ Vue Kanban : Organisation par colonnes de statut

### Filtres Avancés
- ✅ Recherche globale
- ✅ Filtres par statut
- ✅ Filtres par priorité
- ✅ Filtres par tags
- ✅ Effacer tous les filtres

### Tableau de Bord
- ✅ Statistiques globales
- ✅ Projets actifs
- ✅ Projets récents
- ✅ Alertes pour les projets en retard
- ✅ Métriques budgétaires

### Interface Utilisateur
- ✅ Design moderne avec Tailwind CSS
- ✅ Interface responsive (mobile, tablette, desktop)
- ✅ Animations et transitions fluides
- ✅ Feedback visuel
- ✅ Navigation intuitive

## 📦 Technologies Utilisées

- **React 18** - Framework UI
- **TypeScript** - Typage statique
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Framework CSS utility-first
- **Zustand** - Gestion d'état légère
- **React Router** - Navigation
- **Lucide React** - Icônes modernes
- **date-fns** - Manipulation des dates

## 🛠️ Installation

1. **Cloner ou télécharger le projet**

2. **Installer les dépendances**
```bash
npm install
```

3. **Lancer le serveur de développement**
```bash
npm run dev
```

4. **Ouvrir dans le navigateur**
```
http://localhost:5173
```

## 📝 Scripts Disponibles

```bash
# Démarrer le serveur de développement
npm run dev

# Compiler pour la production
npm run build

# Prévisualiser la build de production
npm run preview

# Linter le code
npm run lint
```

## 📁 Structure du Projet

```
project-management-app/
├── src/
│   ├── components/          # Composants réutilisables
│   │   ├── Dashboard/       # Composants du tableau de bord
│   │   ├── Layout/          # Header, Sidebar
│   │   ├── Projects/        # Composants de projets
│   │   └── Tasks/           # Composants de tâches
│   ├── data/                # Données de démonstration
│   ├── pages/               # Pages principales
│   ├── store/               # Gestion d'état Zustand
│   ├── types/               # Types TypeScript
│   ├── utils/               # Fonctions utilitaires
│   ├── App.tsx              # Composant principal
│   ├── main.tsx             # Point d'entrée
│   └── index.css            # Styles globaux
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## 🎨 Personnalisation

### Couleurs
Les couleurs peuvent être modifiées dans `tailwind.config.js` :
```javascript
colors: {
  primary: {
    // Vos couleurs personnalisées
  }
}
```

### Données de démonstration
Les données peuvent être modifiées dans `src/data/mockData.ts`

## 🔧 Configuration

### TypeScript
Configuration dans `tsconfig.json` avec :
- Mode strict activé
- Alias de chemins (@/* pour src/*)
- Support JSX

### Vite
Configuration dans `vite.config.ts` avec :
- Plugin React
- Résolution des alias de chemins

## 📱 Responsive Design

L'application est entièrement responsive avec des breakpoints :
- Mobile : < 768px
- Tablette : 768px - 1024px
- Desktop : > 1024px

## 🚀 Fonctionnalités Futures

- [ ] Authentification et autorisation
- [ ] Backend API
- [ ] Notifications en temps réel
- [ ] Export de rapports (PDF, Excel)
- [ ] Mode sombre
- [ ] Glisser-déposer dans le Kanban
- [ ] Commentaires sur les projets/tâches
- [ ] Historique des modifications
- [ ] Intégrations (Slack, Teams, etc.)
- [ ] Graphiques et analytics avancés

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :
1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est open source et disponible sous la licence MIT.

## 👨‍💻 Auteur

Développé avec ❤️ pour la gestion de projets moderne

---

**Note** : Cette application utilise des données de démonstration. Pour une utilisation en production, connectez-la à un backend avec une base de données réelle.
