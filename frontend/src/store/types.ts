import { StateCreator } from 'zustand';
import { Project, Task, TeamMember, ProjectFilters, ViewMode, Expense } from '@/types';

export interface ProjectSlice {
  projects: Project[];
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  fetchProjects: () => Promise<void>;
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
  getFilteredProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
  getProjectStats: () => {
    total: number;
    active: number;
    completed: number;
    archived: number;
    totalTasks: number;
    completedTasks: number;
  };
}

export interface TaskSlice {
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
}

export interface ExpenseSlice {
  setBudget: (projectId: string, allocated: number) => Promise<void>;
  addExpense: (projectId: string, expense: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => Promise<void>;
  updateExpense: (projectId: string, expenseId: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (projectId: string, expenseId: string) => Promise<void>;
}

export interface FilterSlice {
  filters: ProjectFilters;
  viewMode: ViewMode;
  setFilters: (filters: ProjectFilters) => void;
  setViewMode: (mode: ViewMode) => void;
  clearFilters: () => void;
}

export interface TeamSlice {
  teamMembers: TeamMember[];
  fetchTeamMembers: () => Promise<void>;
}

// Store global combiné
export type ProjectStore = ProjectSlice & TaskSlice & ExpenseSlice & FilterSlice & TeamSlice;

export type SliceCreator<T> = StateCreator<ProjectStore, [], [], T>;
