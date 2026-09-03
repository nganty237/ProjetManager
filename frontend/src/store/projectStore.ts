import { create } from 'zustand';
import { Project, Task, TeamMember, ProjectFilters, ViewMode, Expense } from '@/types';
import api from '@/utils/api';

interface ProjectStore {
  projects: Project[];
  teamMembers: TeamMember[];
  filters: ProjectFilters;
  viewMode: ViewMode;
  selectedProject: Project | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions for project and task management
  fetchProjects: () => Promise<void>;
  fetchTeamMembers: () => Promise<void>;
  addProject: (project: Partial<Project>) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  setSelectedProject: (project: Project | null) => void;
  
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (projectId: string, taskId: string) => Promise<void>;
  
  // Budget & Expenses actions (persisted via API)
  setBudget: (projectId: string, allocated: number) => Promise<void>;
  addExpense: (projectId: string, expense: Omit<Expense, 'id' | 'projectId' | 'createdAt'>) => Promise<void>;
  updateExpense: (projectId: string, expenseId: string, updates: Partial<Expense>) => Promise<void>;
  deleteExpense: (projectId: string, expenseId: string) => Promise<void>;
  
  setFilters: (filters: ProjectFilters) => void;
  setViewMode: (mode: ViewMode) => void;
  clearFilters: () => void;
  
  getFilteredProjects: () => Project[];
  getProjectById: (id: string) => Project | undefined;
  getProjectStats: () => {
    total: number;
    active: number;
    completed: number;
    onHold: number;
    planning: number;
    cancelled: number;
    totalTasks: number;
    completedTasks: number;
  };
}

// Adapts MySQL naming conventions to frontend Project schema
const adaptProject = (project: any | Project): Project => {
  const budgetAllocated = project.budgetAllocated !== undefined 
    ? Number(project.budgetAllocated) 
    : project.budget?.allocated;

  return {
    ...project,
    tasks: project.tasks || project.Tasks || [],
    team: project.team || project.members || [],
    expenses: (project.expenses || []).map((e: any) => ({
      ...e,
      projectId: e.ProjectId || e.projectId || project.id,
      amount: Number(e.amount) || 0,
      date: new Date(e.date || e.createdAt),
    })),
    budget: budgetAllocated !== undefined ? { allocated: budgetAllocated } : undefined,
  };
};

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // État initial
  projects: [],
  teamMembers: [],
  filters: {},
  viewMode: 'grid',
  selectedProject: null,
  isLoading: false,
  error: null,
  
  // Actions - Projets
  fetchProjects: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.get('/projects');
      const adaptedProjects = response.data.map(adaptProject);
      set({ projects: adaptedProjects, isLoading: false });
    } catch (error: any) {
      set({ error: error.message || 'Erreur de chargement', isLoading: false });
      console.error(error);
    }
  },

  fetchTeamMembers: async () => {
    try {
      const response = await api.get('/users');
      set({ teamMembers: response.data });
    } catch (error: any) {
      console.error("Erreur de chargement des membres d'équipe", error);
    }
  },

  addProject: async (projectData) => {
    try {
      const response = await api.post('/projects', projectData);
      set((state) => ({
        projects: [adaptProject(response.data), ...state.projects],
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de l'ajout: ${msg}`, isLoading: false });
      console.error("Erreur lors de l'ajout", error);
    }
  },
  
  updateProject: async (id, updates) => {
    try {
      const response = await api.put(`/projects/${id}`, updates);
      const adapted = adaptProject(response.data);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === id ? { ...project, ...updates, ...adapted, updatedAt: new Date() } : project
        ),
        selectedProject:
          state.selectedProject?.id === id
            ? { ...state.selectedProject, ...updates, ...adapted, updatedAt: new Date() }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de la mise à jour: ${msg}` });
      console.error("Erreur lors de la mise à jour", error);
    }
  },
  
  deleteProject: async (id) => {
    try {
      await api.delete(`/projects/${id}`);
      set((state) => ({
        projects: state.projects.filter((project) => project.id !== id),
        selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de la suppression: ${msg}` });
      console.error("Erreur lors de la suppression", error);
    }
  },
  
  setSelectedProject: (project) => {
    set({ selectedProject: project });
  },
  
  // Actions - Tâches
  addTask: async (projectId, taskData) => {
    try {
      const response = await api.post(`/tasks/${projectId}`, taskData);
      const newTask = response.data.task || response.data;
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks ? [...project.tasks, newTask] : [newTask],
              }
            : project
        ),
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de l'ajout de tâche: ${msg}` });
      console.error("Erreur lors de l'ajout de tâche", error);
    }
  },
  
  updateTask: async (projectId, taskId, updates) => {
    try {
      const response = await api.put(`/tasks/${taskId}`, updates);
      const updatedTask = response.data.task || response.data;
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, ...updates, ...updatedTask } : t)),
              }
            : project
        ),
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur maj tâche: ${msg}` });
      console.error("Erreur maj tâche", error);
    }
  },
  
  deleteTask: async (projectId, taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.filter((t) => t.id !== taskId),
              }
            : project
        ),
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur suppr tâche: ${msg}` });
      console.error("Erreur suppr tâche", error);
    }
  },

  // ===== Actions Budget & Dépenses (Persistance API MySQL) =====

  setBudget: async (projectId, allocated) => {
    try {
      const numAllocated = Number(allocated) || 0;
      await api.put(`/projects/${projectId}/budget`, { allocated: numAllocated });
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, budget: { allocated: numAllocated }, updatedAt: new Date() }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? { ...state.selectedProject, budget: { allocated: numAllocated }, updatedAt: new Date() }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de la mise à jour du budget: ${msg}` });
      console.error("Erreur lors de la mise à jour du budget", error);
    }
  },

  addExpense: async (projectId, expenseData) => {
    try {
      const response = await api.post(`/expenses/${projectId}`, expenseData);
      const newExpense: Expense = {
        ...response.data,
        projectId: response.data.ProjectId || projectId,
        amount: Number(response.data.amount) || 0,
        date: new Date(response.data.date || response.data.createdAt),
      };

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? { ...p, expenses: [newExpense, ...(p.expenses || [])] }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? {
                ...state.selectedProject,
                expenses: [newExpense, ...(state.selectedProject.expenses || [])],
              }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de l'ajout de dépense: ${msg}` });
      console.error("Erreur lors de l'ajout de dépense", error);
    }
  },

  updateExpense: async (projectId, expenseId, updates) => {
    try {
      const response = await api.put(`/expenses/${expenseId}`, updates);
      const updatedExpense: Expense = {
        ...response.data,
        projectId: response.data.ProjectId || projectId,
        amount: Number(response.data.amount) || 0,
        date: new Date(response.data.date || response.data.createdAt),
      };

      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                expenses: (p.expenses || []).map((e) =>
                  e.id === expenseId ? updatedExpense : e
                ),
              }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? {
                ...state.selectedProject,
                expenses: (state.selectedProject.expenses || []).map((e) =>
                  e.id === expenseId ? updatedExpense : e
                ),
              }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de la modification de la dépense: ${msg}` });
      console.error("Erreur lors de la modification de la dépense", error);
    }
  },

  deleteExpense: async (projectId, expenseId) => {
    try {
      await api.delete(`/expenses/${expenseId}`);
      set((state) => ({
        projects: state.projects.map((p) =>
          p.id === projectId
            ? {
                ...p,
                expenses: (p.expenses || []).filter((e) => e.id !== expenseId),
              }
            : p
        ),
        selectedProject:
          state.selectedProject?.id === projectId
            ? {
                ...state.selectedProject,
                expenses: (state.selectedProject.expenses || []).filter((e) => e.id !== expenseId),
              }
            : state.selectedProject,
      }));
    } catch (error: any) {
      const msg = error.response?.data?.message || error.message;
      set({ error: `Erreur lors de la suppression de la dépense: ${msg}` });
      console.error("Erreur lors de la suppression de la dépense", error);
    }
  },

  // Actions - Filtres et Vue
  setFilters: (filters) => {
    set({ filters });
  },
  
  setViewMode: (mode) => {
    set({ viewMode: mode });
  },
  
  clearFilters: () => {
    set({ filters: {} });
  },
  
  // Sélecteurs
  getFilteredProjects: () => {
    const { projects, filters } = get();
    
    return projects.filter((project) => {
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(project.status)) return false;
      }
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(project.priority)) return false;
      }
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = project.title.toLowerCase().includes(searchLower);
        const matchesDescription = project.description?.toLowerCase().includes(searchLower) || false;
        if (!matchesTitle && !matchesDescription) return false;
      }
      return true;
    });
  },
  
  getProjectById: (id) => {
    return get().projects.find((project) => project.id === id);
  },
  
  getProjectStats: () => {
    const { projects } = get();
    return {
      total: projects.length,
      active: projects.filter((p) => p.status === 'active').length,
      completed: projects.filter((p) => p.status === 'completed').length,
      onHold: projects.filter((p) => p.status === 'on-hold').length,
      planning: projects.filter((p) => p.status === 'planning').length,
      cancelled: projects.filter((p) => p.status === 'cancelled').length,
      totalTasks: projects.reduce((sum, p) => sum + (p.tasks ? p.tasks.length : 0), 0),
      completedTasks: projects.reduce(
        (sum, p) => sum + (p.tasks ? p.tasks.filter((t) => t.status === 'done').length : 0),
        0
      ),
    };
  },
}));
