# 🎯 Guide de Démarrage Rapide - Application de Gestion de Projets

## 📋 Table des Matières
1. [Installation](#installation)
2. [Premier Lancement](#premier-lancement)
3. [Guide d'Utilisation](#guide-dutilisation)
4. [Fonctionnalités Détaillées](#fonctionnalités-détaillées)
5. [Astuces et Conseils](#astuces-et-conseils)

---

## 🚀 Installation

### Prérequis
- Node.js 18+ (télécharger sur https://nodejs.org)
- npm ou yarn

### Étapes d'Installation

1. **Extraire l'archive**
   ```bash
   tar -xzf project-management-app.tar.gz
   cd project-management-app
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```
   ⏱️ Temps estimé : 2-3 minutes

3. **Lancer l'application**
   ```bash
   npm run dev
   ```
   
4. **Ouvrir dans le navigateur**
   ```
   http://localhost:5173
   ```

---

## 🎬 Premier Lancement

### Que vais-je voir ?
Au premier lancement, l'application contient déjà des données de démonstration :
- ✅ 6 projets exemples avec différents statuts
- ✅ 5 membres d'équipe fictifs
- ✅ Plusieurs tâches associées aux projets

### Navigation Principale
- **Tableau de bord** : Vue d'ensemble avec statistiques
- **Projets** : Liste de tous les projets
- **Équipe** : Liste des membres
- **Paramètres** : Configuration (interface uniquement)

---

## 📖 Guide d'Utilisation

### 1. Créer un Nouveau Projet

**Méthode 1 : Depuis le Sidebar**
1. Cliquer sur "Nouveau Projet" dans la barre latérale
2. Remplir le formulaire :
   - Titre * (requis)
   - Description * (requis)
   - Statut (Planification, En cours, etc.)
   - Priorité (Basse, Moyenne, Haute, Critique)
   - Dates de début et fin
   - Budget
   - Tags (séparés par des virgules)
   - Membres d'équipe (cases à cocher)
3. Cliquer sur "Créer le projet"

**Méthode 2 : Depuis la page Projets**
1. Aller sur "Projets" dans le menu
2. Cliquer sur "Nouveau Projet" en haut à droite

### 2. Gérer les Projets

#### Modifier un Projet
1. Cliquer sur une carte de projet
2. Cliquer sur "Modifier" en haut à droite
3. Modifier les champs souhaités
4. Cliquer sur "Mettre à jour"

#### Supprimer un Projet
1. Ouvrir les détails du projet
2. Cliquer sur "Supprimer"
3. Confirmer la suppression

⚠️ **Attention** : La suppression est définitive (dans cette version de démo)

### 3. Gérer les Tâches

#### Créer une Tâche
1. Ouvrir un projet
2. Cliquer sur "Nouvelle Tâche"
3. Remplir :
   - Titre *
   - Description *
   - Statut (À faire, En cours, En révision, Terminé)
   - Priorité
   - Assigné à (membre de l'équipe du projet)
   - Date d'échéance
4. Cliquer sur "Créer la tâche"

#### Changer le Statut d'une Tâche Rapidement
1. Sur la carte de tâche, utiliser le menu déroulant du statut
2. Sélectionner le nouveau statut
3. ✅ La tâche est mise à jour automatiquement

#### Modifier/Supprimer une Tâche
- **Modifier** : Cliquer sur l'icône ✏️ sur la carte de tâche
- **Supprimer** : Cliquer sur l'icône 🗑️ sur la carte de tâche

### 4. Filtrer et Rechercher

#### Recherche Globale
1. Utiliser la barre de recherche en haut de la page Projets
2. Taper : titre, description ou tag
3. Les résultats se filtrent en temps réel

#### Filtres Avancés
1. Cliquer sur "Filtres"
2. Cocher les statuts souhaités (ex: Actif, Terminé)
3. Cocher les priorités souhaitées (ex: Haute, Critique)
4. Les projets se filtrent automatiquement

#### Effacer les Filtres
- Cliquer sur "Effacer" à côté du bouton Filtres

### 5. Changer de Vue

Trois modes d'affichage disponibles :

**Vue Grille** 📊
- Cartes visuelles avec toutes les informations
- Idéal pour : vue d'ensemble rapide

**Vue Liste** 📋
- Tableau détaillé horizontal
- Idéal pour : comparer plusieurs projets

**Vue Kanban** 📂
- Colonnes par statut (Planification, En cours, En pause, Terminé)
- Idéal pour : suivre le flux de travail

---

## 🎯 Fonctionnalités Détaillées

### Tableau de Bord

#### Cartes de Statistiques
1. **Total Projets** : Nombre total de projets
2. **Projets Actifs** : En cours de réalisation
3. **Projets Terminés** : Complétés avec succès
4. **En Pause** : Temporairement suspendus
5. **Tâches** : X / Y terminées
6. **Budget Total** : Somme des budgets + dépenses

#### Sections Dynamiques
- **Projets Actifs** : Les 3 projets en cours
- **Récemment Mis à Jour** : Les 3 derniers modifiés
- **Projets en Retard** : Alerte pour les projets dépassant leur date de fin

### Page Détails d'un Projet

#### Informations Affichées
- **Badges** : Statut, Priorité, Tags, Alertes de retard
- **Dates** : Début, Fin, Jours restants
- **Budget** : Total, Dépensé, Restant
- **Progression** : Pourcentage avec barre visuelle
- **Équipe** : Membres avec avatars

#### Statistiques des Tâches
- Répartition par statut (À faire, En cours, En révision, Terminé)
- Vue en chiffres pour un suivi rapide

#### Liste des Tâches
- Toutes les tâches du projet
- Modification/Suppression directe
- Changement de statut en 1 clic

### Page Équipe

#### Informations par Membre
- Avatar et nom
- Rôle
- Email
- **Statistiques** :
  - Nombre de projets
  - Nombre de tâches total
  - Nombre de tâches terminées

---

## 💡 Astuces et Conseils

### Bonnes Pratiques

#### Organisation des Projets
1. **Utilisez les tags** pour regrouper (ex: "Web", "Mobile", "Backend")
2. **Définissez des priorités** dès la création
3. **Mettez à jour la progression** régulièrement
4. **Utilisez les dates de fin** pour le suivi des délais

#### Gestion des Tâches
1. **Assignez toujours** les tâches à un membre
2. **Fixez des dates d'échéance** pour les tâches importantes
3. **Utilisez les priorités** pour hiérarchiser
4. **Décomposez** les gros projets en petites tâches

#### Workflow Recommandé
```
Planification → En cours → En révision → Terminé
      ↓             ↓
  (ajuster)    (si problème: En pause)
```

### Raccourcis et Astuces

#### Navigation Rapide
- Cliquer sur une carte de projet = Ouvrir les détails
- Cliquer sur "← Retour" = Retour à la liste

#### Édition Rapide
- Menu déroulant sur les tâches = Changement de statut immédiat
- Double-vérifier avant de supprimer (pas d'annulation)

#### Filtrage Efficace
1. Combiner recherche + filtres pour plus de précision
2. Utiliser la vue Kanban pour le statut visuel
3. Utiliser la vue Liste pour les comparaisons

### Indicateurs Visuels

#### Couleurs de Statut
- 🔵 Bleu = Planification
- 🟢 Vert = En cours
- 🟡 Jaune = En pause
- 🟣 Violet = Terminé
- 🔴 Rouge = Annulé

#### Couleurs de Priorité
- ⚪ Gris = Basse
- 🔵 Bleu = Moyenne
- 🟠 Orange = Haute
- 🔴 Rouge = Critique

#### Alertes
- ⚠️ En retard = Date de fin dépassée
- 🔥 Critique = Priorité maximale

---

## 🔧 Personnalisation

### Modifier les Couleurs
Fichier : `tailwind.config.js`
```javascript
colors: {
  primary: {
    500: '#0ea5e9', // Couleur principale
    // Modifier selon vos préférences
  }
}
```

### Ajouter Vos Données
Fichier : `src/data/mockData.ts`
- Modifier `mockTeamMembers` pour votre équipe
- Modifier `mockProjects` pour vos projets

### Personnaliser le Logo
Fichier : `src/components/Layout/Sidebar.tsx`
- Ligne 40 : Changer "ProjetHub" par votre nom

---

## 🐛 Dépannage

### L'application ne démarre pas
```bash
# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Port 5173 déjà utilisé
```bash
# Tuer le processus ou utiliser un autre port
npm run dev -- --port 3000
```

### Erreurs de build
```bash
# Vider le cache et rebuilder
npm run build
```

---

## 📞 Support

### Ressources
- Documentation React : https://react.dev
- Documentation TypeScript : https://www.typescriptlang.org
- Documentation Tailwind : https://tailwindcss.com
- Documentation Zustand : https://zustand-demo.pmnd.rs

### Problèmes Courants
- **Les données ne persistent pas** : Normal, c'est une app frontend seulement
- **Pas de notifications** : Fonctionnalité UI uniquement
- **Paramètres ne sauvegardent pas** : Interface de démonstration

---

## 🚀 Prochaines Étapes

Pour aller plus loin :

1. **Connecter un Backend**
   - Remplacer le store Zustand par des appels API
   - Utiliser une base de données (PostgreSQL, MongoDB)

2. **Ajouter l'Authentification**
   - Firebase Auth
   - JWT + Backend custom

3. **Déployer en Production**
   - Vercel (gratuit)
   - Netlify (gratuit)
   - Build : `npm run build`

4. **Améliorations Possibles**
   - Mode sombre
   - Notifications push
   - Export PDF
   - Drag & Drop Kanban
   - Graphiques avancés

---

🎉 **Félicitations !** Vous êtes maintenant prêt à utiliser l'application de gestion de projets !

Pour toute question, consultez le README.md ou la documentation des technologies utilisées.
