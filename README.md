# 🚀 Project Manager

Application moderne de gestion de projets et d'équipes conçue en architecture **Monorepo** découplée (Frontend React + Backend Express + MySQL).

---

## 🏗️ Architecture & Technologies

- **Frontend** : React 18, TypeScript, Vite, Tailwind CSS, Zustand, Lucide Icons.
- **Backend** : Node.js, Express, Sequelize ORM, MySQL, JWT, Zod.
- **Documentation dédiée** :
  - 📖 [Documentation Backend](backend/README.md)
  - 📖 [Documentation Frontend](frontend/README.md)

---

## ⚡ Démarrage Rapide

### 1. Prérequis
- **Node.js** >= 18
- **MySQL** démarré en local (ex: via XAMPP, WAMP ou service MySQL natif)

---

### 2. Lancer le Backend
```bash
cd backend
npm install
cp .env.example .env    # Adapter les accès MySQL dans le .env si besoin
npm run seed            # Crée la DB et initialise le compte admin
npm run dev             # API disponible sur http://localhost:8080
```

---

### 3. Lancer le Frontend
Dans un second terminal :
```bash
cd frontend
npm install
npm run dev             # Application web disponible sur http://localhost:5173
```

---

## 🔑 Compte Administrateur Initial

| Email | Mot de passe | Rôle |
| :--- | :--- | :--- |
| `admin@admin.com` | `admin123` | Administrateur Principal |

---

## 📁 Structure du Projet

```text
project-management-app/
├── backend/    # API REST Express & ORM Sequelize
├── frontend/   # Application SPA React 18 & Vite
└── README.md   # Documentation racine
```
