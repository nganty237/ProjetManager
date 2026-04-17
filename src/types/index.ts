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
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: Date;
  endDate?: Date;
  progress: number; // 0-100
  team: TeamMember[];
  tasks: Task[];
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
