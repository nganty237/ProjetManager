import api from '@/utils/api';
import { ProjectSlice, SliceCreator } from '../types';
import { adaptProject } from '../adapters';

export const createProjectSlice: SliceCreator<ProjectSlice> = (set, get) => ({
  projects: [],
  selectedProject: null,
  isLoading: false,
  error: null,

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
      archived: projects.filter((p) => p.status === 'archived').length,
      totalTasks: projects.reduce((sum, p) => sum + (p.tasks ? p.tasks.length : 0), 0),
      completedTasks: projects.reduce(
        (sum, p) => sum + (p.tasks ? p.tasks.filter((t) => t.status === 'done').length : 0),
        0
      ),
    };
  },
});
