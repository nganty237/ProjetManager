# ⚡ DÉMARRAGE RAPIDE - 5 MINUTES

## 🚀 Installation Express

```bash
# 1. Extraire
tar -xzf project-management-app-final.tar.gz
cd project-management-app

# 2. Installer
npm install

# 3. Lancer
npm run dev
```

**➡️ Ouvrir : http://localhost:5173**

---

## 📱 Premier Aperçu

### Vous verrez :
1. **Sidebar gauche** : Menu de navigation
2. **Header** : Recherche et profil
3. **Dashboard** : Statistiques et projets

### Données de Démo :
✅ 6 projets préchargés
✅ 5 membres d'équipe
✅ 15+ tâches

---

## 🎯 Actions Rapides

### Créer un Projet
1. Cliquer **"Nouveau Projet"** (sidebar ou page Projets)
2. Remplir titre + description
3. Sauvegarder ✅

### Ajouter une Tâche
1. Cliquer sur un projet
2. Cliquer **"Nouvelle Tâche"**
3. Remplir et sauvegarder ✅

### Filtrer
1. Page Projets → **"Filtres"**
2. Cocher statuts/priorités
3. Résultats instantanés ✅

### Changer de Vue
1. Page Projets → Icônes à droite
2. **Grille** 📊 / **Liste** 📋 / **Kanban** 📂

---

## 📚 Documentation

| Fichier | Contenu |
|---------|---------|
| **README.md** | Vue d'ensemble technique |
| **GUIDE.md** | Tutoriels détaillés (8.7 KB) |
| **ARCHITECTURE.md** | Structure technique (15 KB) |
| **LIVRAISON.md** | Récapitulatif complet (11 KB) |

---

## 🔧 Commandes

```bash
npm run dev      # Développement (port 5173)
npm run build    # Build production
npm run preview  # Preview build
npm run lint     # Vérifier le code
```

---

## 🎨 Structure Rapide

```
src/
├── components/     # Composants UI
├── pages/          # Pages principales
├── store/          # État global (Zustand)
├── types/          # Types TypeScript
├── data/           # Données de démo
└── utils/          # Utilitaires
```

---

## ✨ Fonctionnalités Clés

✅ CRUD Projets & Tâches
✅ 3 Vues (Grille/Liste/Kanban)
✅ Filtres avancés
✅ Dashboard avec stats
✅ Gestion d'équipe
✅ Responsive mobile

---

## 🆘 Problème ?

### Port déjà utilisé
```bash
npm run dev -- --port 3000
```

### Erreur d'installation
```bash
rm -rf node_modules package-lock.json
npm install
```

### Cache build
```bash
npm run build
```

---

## 📖 Pour Aller Plus Loin

- **Usage détaillé** → Lire `GUIDE.md`
- **Architecture** → Lire `ARCHITECTURE.md`
- **Personnalisation** → Modifier `tailwind.config.js`
- **Backend** → Voir section "Extensions" dans `ARCHITECTURE.md`

---

## 🎯 Prochaines Étapes

1. ✅ Explorer l'interface
2. ✅ Créer votre premier projet
3. ✅ Ajouter des tâches
4. 📚 Lire GUIDE.md pour les détails
5. 🔧 Personnaliser selon vos besoins

---

**🚀 C'est parti ! Bonne gestion de projets !**
