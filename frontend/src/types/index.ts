// Types pour les projets
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'cancelled';
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: ProjectPriority;
  assignedTo?: TeamMember;
  assignedToId?: string;
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

// ===== TYPES FINANCIERS =====

export type ExpenseCategory =
  | 'personnel'       // Salaires, primes, indemnités
  | 'software'        // Licences logicielles, SaaS, abonnements
  | 'hardware'        // Matériel informatique, équipements
  | 'subcontracting'  // Sous-traitance, freelances, prestataires
  | 'marketing'       // Publicité, supports de communication
  | 'travel'          // Déplacements, hébergement, per diem
  | 'other';          // Autres dépenses diverses

export interface Expense {
  id: string;
  projectId: string;
  label: string;            // Libellé de la dépense
  amount: number;           // Montant en FCFA
  category: ExpenseCategory;
  date: Date;
  description?: string;     // Justificatif / note complémentaire
  createdBy: string;        // Nom de l'utilisateur qui a enregistré
  createdAt: Date;
}

export interface ProjectBudget {
  allocated: number;        // Budget alloué en FCFA
}

// ===== FIN TYPES FINANCIERS =====

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate?: Date;
  team: TeamMember[];
  tasks: Task[];
  budget?: ProjectBudget;   // Budget financier (optionnel)
  expenses: Expense[];      // Dépenses enregistrées
  createdAt: Date;
  updatedAt: Date;
}

// Types pour les filtres
export interface ProjectFilters {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  search?: string;
}

// Type pour les statistiques
export interface ProjectStats {
  total: number;
  active: number;
  completed: number;
  onHold: number;
  totalTasks: number;
  completedTasks: number;
}

// View modes
export type ViewMode = 'grid' | 'list' | 'kanban';
