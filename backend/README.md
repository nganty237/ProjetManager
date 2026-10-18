# ⚙️ Backend API — Project Manager

API RESTful développée avec **Node.js**, **Express**, **Sequelize** et **MySQL**.

---

## 🛠️ Stack Technique

- **Runtime** : Node.js (ES Modules)
- **Framework** : Express 4.18
- **Base de données** : MySQL via Sequelize ORM
- **Sécurité** : JWT, Bcrypt.js, Zod (validation des schémas), express-rate-limit

---

## 🚀 Installation & Lancement

1. **Installer les dépendances** :
   ```bash
   npm install
   ```

2. **Configurer l'environnement** :
   Copiez le fichier d'exemple et renseignez vos identifiants MySQL :
   ```bash
   cp .env.example .env
   ```
   *Variables principales dans `.env` :*
   - `PORT=8080`
   - `DB_HOST=127.0.0.1`
   - `DB_USER=root`
   - `DB_PASS=`
   - `DB_NAME=project_manager`
   - `JWT_SECRET=votre_cle_secrete_ici`

3. **Initialiser la base de données & l'administrateur** :
   ```bash
   npm run seed
   ```
   *(La base de données et les tables sont créées automatiquement si elles n'existent pas)*

4. **Démarrer le serveur** :
   ```bash
   npm run dev       # Mode développement (rechargement automatique)
   ```
   Le serveur écoute sur : **`http://localhost:8080`**

---

## 📜 Scripts Disponibles

| Commande | Action |
| :--- | :--- |
| `npm run dev` | Démarre le serveur avec Nodemon |
| `npm start` | Démarre le serveur en mode Node classique |
| `npm run seed` | Initialise la base et le compte admin par défaut |
| `npm run reset-db` | Réinitialise complètement la base (efface les tables) |

---

## 📡 Endpoints Clés

- **Santé & Diagnostic** : `GET /api/health`
- **Authentification** : `POST /api/auth/login`, `POST /api/auth/activate`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- **Utilisateurs & Équipe** : `/api/users` (`GET`, `POST`), `/api/users/me` (`GET`, `PUT`)
- **Projets & Budgets** : `/api/projects` (`GET`, `POST`, `PUT`, `DELETE`), `/api/projects/:id/budget`
- **Tâches** : `/api/tasks/:projectId` (`POST`), `/api/tasks/:taskId` (`PUT`, `DELETE`)
- **Dépenses** : `/api/expenses/:projectId` (`GET`, `POST`), `/api/expenses/item/:id` (`PUT`, `DELETE`)
