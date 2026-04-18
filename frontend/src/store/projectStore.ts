import { create } from 'zustand';
import { Project, Task, TeamMember, ProjectFilters, ViewMode } from '@/types';
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

// Adapts MySQL naming conventions (Tasks/members) to frontend naming conventions (tasks/team)
const adaptProject = (project: any | Project): Project => {
  return {
    ...project,
    tasks: project.tasks || project.Tasks || [],
    team: project.team || project.members || [],
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
      // The backend expects teamIds instead of team. Let's adapt output payload if needed or just let it pass
      // Actually backend accepts what we send, but team assignment would need teamIds. For now we just adapt response.
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
      const newTask = response.data.task || response.data; // Adapte selon ce que backend renvoie
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
      await api.put(`/tasks/${taskId}`, updates);
      set((state) => ({
        projects: state.projects.map((project) =>
          project.id === projectId
            ? {
                ...project,
                tasks: project.tasks.map((t) => (t.id === taskId ? { ...t, ...updates } : t)),
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
      // Filtre par statut
      if (filters.status && filters.status.length > 0) {
        if (!filters.status.includes(project.status)) return false;
      }
      
      // Filtre par priorité
      if (filters.priority && filters.priority.length > 0) {
        if (!filters.priority.includes(project.priority)) return false;
      }
      
      // Filtre par recherche
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
    
    const stats = {
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
    
    return stats;
  },
}));
