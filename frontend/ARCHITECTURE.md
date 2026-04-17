# 🗺️ Architecture et Structure du Projet

## 📐 Architecture Technique

### Stack Technologique

```
┌─────────────────────────────────────────┐
│          Frontend (React 18)             │
├─────────────────────────────────────────┤
│  UI Layer (Tailwind CSS + Lucide Icons) │
├─────────────────────────────────────────┤
│    State Management (Zustand)            │
├─────────────────────────────────────────┤
│    Routing (React Router v6)             │
├─────────────────────────────────────────┤
│    Build Tool (Vite)                     │
└─────────────────────────────────────────┘
```

### Architecture des Composants

```
App.tsx (Router + Layout)
│
├── Sidebar (Navigation)
│   └── Menu Items
│       ├── Dashboard
│       ├── Projects
│       ├── Team
│       └── Settings
│
├── Header (Search + User)
│
└── Main Content Area
    │
    ├── Dashboard Page
    │   ├── StatsCards
    │   ├── Active Projects
    │   ├── Recent Projects
    │   └── Overdue Projects
    │
    ├── Projects Page
    │   ├── ProjectFilters
    │   ├── View Mode Toggle
    │   └── Projects Display
    │       ├── ProjectGrid (ProjectCard[])
    │       ├── ProjectList
    │       └── ProjectKanban
    │
    ├── ProjectDetail Page
    │   ├── Project Header
    │   ├── Project Stats
    │   ├── Task Statistics
    │   └── TaskCard[]
    │
    ├── Team Page
    │   └── TeamMemberCard[]
    │
    └── Settings Page
        └── Settings Sections
```

---

## 🗂️ Structure des Dossiers Détaillée

```
project-management-app/
│
├── public/                          # Assets statiques
│
├── src/
│   │
│   ├── components/                  # Composants réutilisables
│   │   │
│   │   ├── Dashboard/
│   │   │   └── StatsCards.tsx      # Cartes de statistiques du tableau de bord
│   │   │
│   │   ├── Layout/
│   │   │   ├── Header.tsx          # En-tête avec recherche et profil
│   │   │   └── Sidebar.tsx         # Navigation latérale
│   │   │
│   │   ├── Projects/
│   │   │   ├── ProjectCard.tsx     # Carte de projet (vue grille)
│   │   │   ├── ProjectFilters.tsx  # Filtres et recherche
│   │   │   ├── ProjectForm.tsx     # Formulaire création/édition
│   │   │   ├── ProjectKanban.tsx   # Vue Kanban par statut
│   │   │   └── ProjectList.tsx     # Vue liste des projets
│   │   │
│   │   └── Tasks/
│   │       ├── TaskCard.tsx        # Carte de tâche
│   │       └── TaskForm.tsx        # Formulaire création/édition tâche
│   │
│   ├── data/
│   │   └── mockData.ts             # Données de démonstration
│   │                                 • 6 projets exemples
│   │                                 • 5 membres d'équipe
│   │                                 • 15+ tâches
│   │
│   ├── pages/                       # Pages principales (Routes)
│   │   ├── Dashboard.tsx           # Tableau de bord
│   │   ├── Projects.tsx            # Liste des projets
│   │   ├── ProjectDetail.tsx       # Détails d'un projet
│   │   ├── Team.tsx                # Page équipe
│   │   └── Settings.tsx            # Page paramètres
│   │
│   ├── store/
│   │   └── projectStore.ts         # État global Zustand
│   │                                 • Projects CRUD
│   │                                 • Tasks CRUD
│   │                                 • Filters
│   │                                 • Selectors
│   │
│   ├── types/
│   │   └── index.ts                # Types TypeScript
│   │                                 • Project
│   │                                 • Task
│   │                                 • TeamMember
│   │                                 • ProjectStatus
│   │                                 • ProjectPriority
│   │                                 • Filters
│   │
│   ├── utils/
│   │   └── constants.ts            # Constantes et utilitaires
│   │                                 • Status config
│   │                                 • Priority config
│   │                                 • Date formatters
│   │                                 • Currency formatters
│   │
│   ├── App.tsx                     # Composant racine
│   ├── main.tsx                    # Point d'entrée
│   ├── index.css                   # Styles globaux Tailwind
│   └── vite-env.d.ts               # Types Vite
│
├── index.html                       # Template HTML
├── package.json                     # Dépendances npm
├── tsconfig.json                    # Config TypeScript
├── vite.config.ts                  # Config Vite
├── tailwind.config.js              # Config Tailwind CSS
├── postcss.config.js               # Config PostCSS
├── .gitignore                      # Fichiers à ignorer
├── README.md                        # Documentation principale
└── GUIDE.md                         # Guide utilisateur
```

---

## 🔄 Flux de Données

### Gestion d'État avec Zustand

```
┌──────────────────────────────────────────────────┐
│              Zustand Store                        │
│  (src/store/projectStore.ts)                     │
├──────────────────────────────────────────────────┤
│                                                   │
│  State:                                           │
│    • projects: Project[]                          │
│    • teamMembers: TeamMember[]                    │
│    • filters: ProjectFilters                      │
│    • viewMode: ViewMode                           │
│    • selectedProject: Project | null              │
│                                                   │
│  Actions:                                         │
│    • addProject()                                 │
│    • updateProject()                              │
│    • deleteProject()                              │
│    • addTask()                                    │
│    • updateTask()                                 │
│    • deleteTask()                                 │
│    • setFilters()                                 │
│    • setViewMode()                                │
│                                                   │
│  Selectors:                                       │
│    • getFilteredProjects()                        │
│    • getProjectById()                             │
│    • getProjectStats()                            │
│                                                   │
└──────────────────────────────────────────────────┘
         ↑                    ↓
         │                    │
    Components          React Hooks
    call actions      (useProjectStore)
```

### Exemple de Flux

1. **Créer un Projet**
   ```
   User clicks "Nouveau Projet"
         ↓
   ProjectForm component opens
         ↓
   User fills form and submits
         ↓
   Form calls: addProject(data)
         ↓
   Store adds project to state
         ↓
   All subscribed components re-render
         ↓
   ProjectForm closes
   ```

2. **Filtrer les Projets**
   ```
   User types in search bar
         ↓
   ProjectFilters calls: setFilters({search: "..."})
         ↓
   Store updates filters
         ↓
   Projects page calls: getFilteredProjects()
         ↓
   Returns filtered array
         ↓
   Components display filtered results
   ```

---

## 🎨 Design System

### Palette de Couleurs

```css
Primary (Blue):
  50:  #f0f9ff   (Background très clair)
  100: #e0f2fe   (Background clair)
  500: #0ea5e9   (Principal)
  600: #0284c7   (Hover)
  700: #0369a1   (Active)

Status Colors:
  Planning:  Blue (#3b82f6)
  Active:    Green (#10b981)
  On-Hold:   Yellow (#f59e0b)
  Completed: Purple (#8b5cf6)
  Cancelled: Red (#ef4444)

Priority Colors:
  Low:       Gray (#6b7280)
  Medium:    Blue (#3b82f6)
  High:      Orange (#f97316)
  Critical:  Red (#ef4444)
```

### Composants Réutilisables (Tailwind Classes)

```css
/* Boutons */
.btn                 → Base button styles
.btn-primary         → Primary action button
.btn-secondary       → Secondary button
.btn-danger          → Destructive action
.btn-sm              → Small button

/* Cards */
.card                → Base card container

/* Forms */
.input               → Input field styling
.label               → Form label styling

/* Badges */
.badge               → Small tag/badge component
```

---

## 🔌 Points d'Extension

### 1. Ajouter un Backend

**Étape 1** : Créer une API
```typescript
// src/api/projects.ts
export const projectsApi = {
  getAll: () => fetch('/api/projects'),
  create: (data) => fetch('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  // ...
}
```

**Étape 2** : Modifier le Store
```typescript
// Remplacer les actions du store
addProject: async (project) => {
  const response = await projectsApi.create(project);
  const newProject = await response.json();
  set((state) => ({
    projects: [...state.projects, newProject]
  }));
}
```

### 2. Ajouter l'Authentification

**Étape 1** : Créer un Auth Context
```typescript
// src/contexts/AuthContext.tsx
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  // Logic d'auth
}
```

**Étape 2** : Protéger les Routes
```typescript
// src/components/ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}
```

### 3. Ajouter le Drag & Drop (Kanban)

**Bibliothèque recommandée** : `@dnd-kit/core`
```typescript
import { DndContext, closestCenter } from '@dnd-kit/core';

// Envelopper ProjectKanban avec DndContext
// Ajouter useDraggable aux cartes
// Ajouter useDroppable aux colonnes
```

### 4. Ajouter des Graphiques

**Bibliothèque recommandée** : `recharts`
```bash
npm install recharts
```

```typescript
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

// Dans Dashboard.tsx
<BarChart data={chartData}>
  <Bar dataKey="completed" fill="#10b981" />
</BarChart>
```

---

## 📊 Modèle de Données

### Project Schema

```typescript
interface Project {
  id: string;                    // Unique identifier
  title: string;                 // Project name
  description: string;           // Full description
  status: ProjectStatus;         // Current state
  priority: ProjectPriority;     // Importance level
  startDate: Date;               // Start date
  endDate?: Date;                // End date (optional)
  progress: number;              // 0-100
  budget?: number;               // Budget in currency
  spent?: number;                // Amount spent
  tags: string[];                // Categories
  team: TeamMember[];            // Assigned members
  tasks: Task[];                 // Related tasks
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last update timestamp
}
```

### Task Schema

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: ProjectPriority;
  assignedTo?: TeamMember;       // Optional assignment
  dueDate?: Date;                // Optional deadline
  createdAt: Date;
  updatedAt: Date;
}
```

### TeamMember Schema

```typescript
interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;               // Profile picture URL
  role: string;                  // Job title
}
```

---

## 🔐 Bonnes Pratiques du Code

### TypeScript
- ✅ Tous les fichiers sont typés
- ✅ Types stricts activés
- ✅ Interfaces réutilisables
- ✅ Pas de `any`

### React
- ✅ Composants fonctionnels uniquement
- ✅ Hooks personnalisés possibles
- ✅ Props typées avec interfaces
- ✅ Separation of concerns

### Performance
- ✅ Composants optimisés (pas de re-renders inutiles)
- ✅ Zustand pour state global
- ✅ React Router pour code splitting

### Accessibilité
- ✅ Labels sur tous les formulaires
- ✅ Boutons avec texte descriptif
- ✅ Couleurs avec bon contraste
- ✅ Navigation au clavier

---

## 🚀 Roadmap Recommandée

### Phase 1 : MVP (Actuel) ✅
- [x] CRUD Projets
- [x] CRUD Tâches
- [x] Filtres et recherche
- [x] 3 vues (Grille, Liste, Kanban)
- [x] Dashboard avec stats

### Phase 2 : Backend
- [ ] API REST ou GraphQL
- [ ] Base de données (PostgreSQL)
- [ ] Authentification JWT
- [ ] Permissions utilisateurs

### Phase 3 : Fonctionnalités Avancées
- [ ] Notifications en temps réel (WebSocket)
- [ ] Commentaires sur projets/tâches
- [ ] Historique des modifications
- [ ] Upload de fichiers
- [ ] Mode sombre

### Phase 4 : Intégrations
- [ ] Export PDF/Excel
- [ ] Calendrier (Google Calendar)
- [ ] Slack/Teams notifications
- [ ] Email notifications
- [ ] Webhooks

### Phase 5 : Analytics
- [ ] Graphiques avancés
- [ ] Rapports personnalisés
- [ ] Prédictions IA
- [ ] KPIs customisables

---

## 📚 Ressources Additionnelles

### Documentation
- React : https://react.dev
- TypeScript : https://typescriptlang.org/docs
- Tailwind : https://tailwindcss.com/docs
- Zustand : https://docs.pmnd.rs/zustand
- Vite : https://vitejs.dev

### Tutoriels Recommandés
- React + TypeScript : https://react-typescript-cheatsheet.netlify.app
- Tailwind CSS : https://tailwindcss.com/docs/utility-first
- State Management : https://kentcdodds.com/blog/application-state-management-with-react

### Communautés
- React Discord : https://discord.gg/react
- TypeScript Discord : https://discord.gg/typescript
- Stack Overflow : Tag `reactjs`, `typescript`, `tailwindcss`

---

✨ **Bonne chance avec votre projet !**
