import { create } from 'zustand';
import { Project, Task, TeamMember, ProjectFilters, ViewMode } from '@/types';
import { mockProjects, mockTeamMembers } from '@/data/mockData';

interface ProjectStore {
  // État
  projects: Project[];
  teamMembers: TeamMember[];
  filters: ProjectFilters;
  viewMode: ViewMode;
  selectedProject: Project | null;
  
  // Actions - Projets
  addProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  setSelectedProject: (project: Project | null) => void;
  
  // Actions - Tâches
  addTask: (projectId: string, task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (projectId: string, taskId: string, updates: Partial<Task>) => void;
  deleteTask: (projectId: string, taskId: string) => void;
  
  // Actions - Filtres et Vue
  setFilters: (filters: ProjectFilters) => void;
  setViewMode: (mode: ViewMode) => void;
  clearFilters: () => void;
  
  // Sélecteurs
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

export const useProjectStore = create<ProjectStore>((set, get) => ({
  // État initial
  projects: mockProjects,
  teamMembers: mockTeamMembers,
  filters: {},
  viewMode: 'grid',
  selectedProject: null,
  
  // Actions - Projets
  addProject: (projectData) => {
    const newProject: Project = {
      ...projectData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      projects: [...state.projects, newProject],
    }));
  },
  
  updateProject: (id, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === id
          ? { ...project, ...updates, updatedAt: new Date() }
          : project
      ),
      selectedProject:
        state.selectedProject?.id === id
          ? { ...state.selectedProject, ...updates, updatedAt: new Date() }
          : state.selectedProject,
    }));
  },
  
  deleteProject: (id) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== id),
      selectedProject: state.selectedProject?.id === id ? null : state.selectedProject,
    }));
  },
  
  setSelectedProject: (project) => {
    set({ selectedProject: project });
  },
  
  // Actions - Tâches
  addTask: (projectId, taskData) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: [...project.tasks, newTask],
              updatedAt: new Date(),
            }
          : project
      ),
    }));
  },
  
  updateTask: (projectId, taskId, updates) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, ...updates, updatedAt: new Date() }
                  : task
              ),
              updatedAt: new Date(),
            }
          : project
      ),
    }));
  },
  
  deleteTask: (projectId, taskId) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
              updatedAt: new Date(),
            }
          : project
      ),
    }));
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
        const matchesDescription = project.description.toLowerCase().includes(searchLower);
        
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
      totalTasks: projects.reduce((sum, p) => sum + p.tasks.length, 0),
      completedTasks: projects.reduce(
        (sum, p) => sum + p.tasks.filter((t) => t.status === 'done').length,
        0
      ),
    };
    
    return stats;
  },
}));
