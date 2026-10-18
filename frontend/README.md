# 💻 Frontend Client — Project Manager

Application web monopage (SPA) développée avec **React 18**, **TypeScript**, **Vite** et **Tailwind CSS**.

---

## 🛠️ Stack Technique

- **Framework UI** : React 18
- **Langage** : TypeScript
- **Tooling & Build** : Vite 5
- **Style** : Tailwind CSS
- **Gestion d'état** : Zustand
- **Routage** : React Router DOM v6
- **Requêtes HTTP** : Axios (avec intercepteurs JWT)
- **Exports & Icônes** : jsPDF, Lucide React

---

## 🚀 Installation & Lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer l'URL de l'API (optionnel)** :
   Créez un fichier `.env` si votre backend n'utilise pas le port par défaut :
   ```env
   VITE_API_URL=http://localhost:8080/api
   ```
   *(Par défaut, pointe sur `http://localhost:8080/api`)*

3. **Démarrer l'application** :
   ```bash
   npm run dev
   ```
   L'application est accessible sur : **`http://localhost:5173`**

---

## 📜 Scripts Disponibles

| Commande | Action |
| :--- | :--- |
| `npm run dev` | Lance le serveur de développement Vite |
| `npm run build` | Vérifie les types (`tsc`) et génère le bundle de production dans `dist/` |
| `npm run preview` | Prévisualise la version de production localement |
| `npm run lint` | Analyse la qualité du code avec ESLint |

---

## 📱 Modules Principaux

- **Tableau de Bord** : Vue synthétique des projets en cours, alertes retards et métriques.
- **Projets** : Vues Grille, Liste et tableau Kanban avec filtres dynamiques.
- **Tâches** : Suivi des tâches, statuts, assignations et priorités.
- **Finances** : Suivi du budget alloué et des dépenses par projet.
- **Équipe & Administration** : Annuaire des membres, invitations et gestion des rôles.
- **Rapports** : Génération et téléchargement de synthèses de projet au format PDF.
